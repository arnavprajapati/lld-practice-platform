import { EvaluationStrategy, Problem, Attempt, Feedback } from '../domain';

/**
 * Mock evaluator that returns hardcoded feedback after a 2-second delay.
 * Will be replaced with an AI-backed strategy later.
 */
export class MockEvaluationStrategy implements EvaluationStrategy {
  async evaluate(problem: Problem, attempt: Attempt): Promise<Feedback> {
    // Simulate async evaluation work
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      overallScore: 72,
      summary: `Decent attempt at "${problem.title}". The solution covers several core requirements but could go deeper on design principles.`,
      strengths: [
        'Identifies the key entities and their relationships.',
        'Addresses the main use-case flow end to end.',
        'Readable structure with clear separation of concerns.',
      ],
      improvements: [
        'Apply the Open/Closed principle — make the design extensible without modification.',
        'Add concurrency considerations for multi-user scenarios.',
        'Flesh out edge cases mentioned in the requirements.',
      ],
      designPrinciples: [
        { name: 'Single Responsibility', met: true, comment: 'Classes have focused responsibilities.' },
        { name: 'Open/Closed', met: false, comment: 'Design is not easily extensible without modifying existing classes.' },
        { name: 'Encapsulation', met: true, comment: 'Internal state is properly hidden behind methods.' },
        { name: 'Appropriate Abstraction', met: true, comment: 'Good use of interfaces and type hierarchies.' },
        { name: 'Concurrency Safety', met: false, comment: 'No concurrency handling discussed.' },
      ],
    };
  }
}

