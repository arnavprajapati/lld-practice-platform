import { GoogleGenerativeAI } from '@google/generative-ai';
import { EvaluationStrategy, Problem, Attempt, Feedback } from '../domain';

function cleanMarkdownText(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .trim();
}

/**
 * Gemini-backed evaluator using available free-tier models (gemini-2.5-flash, gemini-2.0-flash, gemini-1.5-flash-latest, etc.).
 */
export class GeminiEvaluationStrategy implements EvaluationStrategy {
  private readonly genAI: GoogleGenerativeAI;
  private readonly modelNames: string[];

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    // Priority order of model names to try
    const envModel = process.env.GEMINI_MODEL;
    this.modelNames = envModel
      ? [envModel, 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro']
      : ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro'];
  }

  async evaluate(problem: Problem, attempt: Attempt): Promise<Feedback> {
    const numberedRequirements = problem.requirements
      .map((r, i) => `${i + 1}. ${r}`)
      .join('\n');

    const prompt = `You are an expert Low-Level Design (LLD) evaluator. A learner has submitted a solution to the following problem. Evaluate their design thoroughly.

PROBLEM TITLE: ${problem.title}

PROBLEM DESCRIPTION: ${problem.description}

REQUIREMENTS:
${numberedRequirements}

LEARNER'S SUBMITTED SOLUTION (${attempt.solution.type}):
${attempt.solution.content}

TASK: Evaluate the above LLD solution and return your evaluation as a JSON object with this EXACT structure. Return ONLY the raw JSON. Do NOT use markdown bold like **text** or backticks inside any string fields.

{
  "overallScore": <number between 0 and 100>,
  "summary": "<2-3 line overall verdict of the design>",
  "strengths": ["<specific strength 1>", "<specific strength 2>", "<specific strength 3>"],
  "improvements": ["<specific improvement 1>", "<specific improvement 2>", "<specific improvement 3>"],
  "designPrinciples": [
    { "name": "Single Responsibility", "met": <boolean>, "comment": "<specific observation>" },
    { "name": "Open/Closed Principle", "met": <boolean>, "comment": "<specific observation>" },
    { "name": "Proper Abstraction", "met": <boolean>, "comment": "<specific observation>" },
    { "name": "Encapsulation", "met": <boolean>, "comment": "<specific observation>" }
  ]
}

Return ONLY valid JSON. No other text.`;

    let rawText: string | undefined;
    let lastError: any;

    for (const modelName of this.modelNames) {
      try {
        const model = this.genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        rawText = result.response.text();
        if (rawText) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying fallback...`);
      }
    }

    if (!rawText) {
      console.error('Gemini API Error:', lastError?.message || lastError);
      throw new Error(`AI evaluation failed: ${lastError?.message || 'Unknown API error'}`);
    }

    // Strip accidental markdown fences before parsing
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
    }

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      throw new Error('Invalid feedback format');
    }

    // Clamp overallScore to 0–100
    const overallScore = Math.max(0, Math.min(100, Number(parsed.overallScore) || 0));

    const feedback: Feedback = {
      overallScore,
      summary: cleanMarkdownText(parsed.summary),
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(cleanMarkdownText) : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements.map(cleanMarkdownText) : [],
      designPrinciples: Array.isArray(parsed.designPrinciples)
        ? parsed.designPrinciples.map((dp: any) => ({
            name: cleanMarkdownText(dp.name),
            met: Boolean(dp.met),
            comment: cleanMarkdownText(dp.comment),
          }))
        : [],
    };

    return feedback;
  }
}
