import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { EvaluationStrategy, Problem, Attempt, Feedback } from '../domain';

/**
 * Gemini-backed evaluator using the free-tier gemini-1.5-flash model.
 * Model is initialized once in the constructor, reused across calls.
 */
export class GeminiEvaluationStrategy implements EvaluationStrategy {
  private readonly model: GenerativeModel;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
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

TASK: Evaluate the above LLD solution and return your evaluation as a JSON object with this EXACT structure. Return ONLY the raw JSON. No markdown, no backticks, no explanation outside the JSON.

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

    let rawText: string;
    try {
      const result = await this.model.generateContent(prompt);
      rawText = result.response.text();
    } catch (err) {
      throw new Error('AI evaluation failed');
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
      summary: String(parsed.summary ?? ''),
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String) : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements.map(String) : [],
      designPrinciples: Array.isArray(parsed.designPrinciples)
        ? parsed.designPrinciples.map((dp: any) => ({
            name: String(dp.name ?? ''),
            met: Boolean(dp.met),
            comment: String(dp.comment ?? ''),
          }))
        : [],
    };

    return feedback;
  }
}
