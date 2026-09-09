import type { Feedback, Problem, Solution } from "../types";

/**
 * Deterministic, client-side mock evaluator.
 *
 * This is a stand-in for the server's EvaluationStrategy — the frontend-only
 * build has no backend, so we derive structured, plausible-looking feedback
 * from lightweight heuristics over the submitted text. The same input always
 * produces the same output, which keeps the UI predictable to demo and review.
 */

/** Design-principle vocabulary we scan the solution for. */
const PRINCIPLES: { name: string; keywords: string[] }[] = [
  {
    name: "Single Responsibility",
    keywords: ["responsib", "class", "service", "manager", "separate", "cohes"],
  },
  {
    name: "Open/Closed",
    keywords: ["extend", "interface", "abstract", "strategy", "plugin", "polymorph"],
  },
  {
    name: "Encapsulation",
    keywords: ["private", "encapsulat", "state", "field", "internal", "expose"],
  },
  {
    name: "Appropriate Abstraction",
    keywords: ["interface", "abstract", "enum", "type", "model", "entity"],
  },
  {
    name: "Concurrency Safety",
    keywords: ["concurren", "lock", "synchron", "atomic", "thread", "race"],
  },
];

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

/** Count how many distinct requirement themes the text appears to touch. */
function requirementCoverage(text: string, problem: Problem): number {
  const lower = text.toLowerCase();
  let hit = 0;
  for (const req of problem.requirements) {
    const words = req
      .toLowerCase()
      .replace(/[^a-z\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 4);
    if (words.some((w) => lower.includes(w))) hit += 1;
  }
  return hit;
}

/**
 * Produce structured feedback for a solution against a problem.
 * Pure and synchronous — the "evaluating" delay is handled in the UI.
 */
export function evaluateSolution(problem: Problem, solution: Solution): Feedback {
  const text = solution.content.trim();
  const lower = text.toLowerCase();
  const wordCount = text ? text.split(/\s+/).length : 0;

  const coverage = requirementCoverage(text, problem);
  const coverageRatio = problem.requirements.length
    ? coverage / problem.requirements.length
    : 0;

  const designPrinciples = PRINCIPLES.map((p) => {
    const met = p.keywords.some((k) => lower.includes(k));
    return {
      name: p.name,
      met,
      comment: met
        ? `Your design shows evidence of ${p.name.toLowerCase()}.`
        : `Consider how your design addresses ${p.name.toLowerCase()}.`,
    };
  });

  const metCount = designPrinciples.filter((p) => p.met).length;

  // Blend requirement coverage, principle coverage, and enough detail to
  // reason about — then clamp into a sensible 20–98 band.
  const depthScore = clamp(wordCount / 220, 0, 1); // ~220 words reads as thorough
  const raw =
    coverageRatio * 45 + (metCount / PRINCIPLES.length) * 35 + depthScore * 20;
  const overallScore = clamp(Math.round(raw), text ? 20 : 0, 98);

  const strengths: string[] = [];
  if (coverage > 0) {
    strengths.push(
      `Addresses ${coverage} of ${problem.requirements.length} stated requirements.`,
    );
  }
  if (metCount >= 3) {
    strengths.push("Applies several core object-oriented design principles.");
  }
  if (wordCount >= 150) {
    strengths.push("Explains the design with a good level of detail.");
  }
  if (solution.type === "code") {
    strengths.push("Provides a concrete implementation rather than prose alone.");
  }
  if (strengths.length === 0) {
    strengths.push("A starting point is in place to build on.");
  }

  const improvements: string[] = [];
  if (coverageRatio < 0.6) {
    improvements.push(
      "Cover more of the listed requirements explicitly in your design.",
    );
  }
  const missing = designPrinciples.filter((p) => !p.met).slice(0, 2);
  for (const m of missing) {
    improvements.push(`Address ${m.name} more directly in your classes.`);
  }
  if (wordCount < 120) {
    improvements.push(
      "Expand on class responsibilities, relationships, and key methods.",
    );
  }
  if (improvements.length === 0) {
    improvements.push(
      "Tighten edge-case handling and document your key design trade-offs.",
    );
  }

  const summary = text
    ? `Your solution touches ${coverage} of ${problem.requirements.length} requirements and reflects ${metCount} of ${PRINCIPLES.length} core design principles. ${
        overallScore >= 75
          ? "This is a solid, well-rounded design."
          : overallScore >= 50
            ? "A reasonable foundation with clear room to deepen the design."
            : "An early draft — flesh out the design to strengthen it."
      }`
    : "No solution was provided to evaluate.";

  return { overallScore, summary, strengths, improvements, designPrinciples };
}
