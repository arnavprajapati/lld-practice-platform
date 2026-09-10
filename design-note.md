# Design Note: LLD Practice Platform Architecture & Design

## 1. System Architecture & MVP Scope

The **LLD Practice Platform** is built as a lightweight TypeScript monorepo consisting of an Express REST API server and a React single-page application (SPA). 

### MVP Scope Boundaries:
- **Included**: Problem browsing, detailed requirement viewing, text/code solution submission, asynchronous AI evaluation with live status polling, structured feedback visualization, attempt history tracking, in-memory storage, 100% server unit test coverage.
- **Excluded**: Multi-tenant auth/JWT (hardcoded to `user-1`), persistent SQL/NoSQL database, interactive UML diagram editor.

```
┌────────────────────────────────────────────────────────┐
│                   React Client (SPA)                   │
│   Home Page ──► Problem Detail ──► Attempt Status ◄──┐ │
│         │                               │            │ │
│         └──────────────► History ───────┘            │ │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / REST
┌───────────────────────────▼────────────────────────────┐
│                  Express Server (Node.js)              │
│  ProblemController               AttemptController     │
│         │                               │              │
│  ProblemRepository              AttemptService         │
│         │                          │         │         │
│  (3 Seeded Problems)    AttemptRepository  Evaluation  │
│                                            Strategy    │
│                                              │         │
│                                      Gemini Strategy   │
└────────────────────────────────────────────────────────┘
```

---

## 2. Core User Flow

```
[User visits Home /]
       │
       ▼
[Selects LLD Problem (e.g. Parking Lot)]
       │
       ▼
[Reads Requirements & Examples on /problems/:id]
       │
       ▼
[Drafts Solution (Text/Code) & clicks Submit]
       │
       ├─► POST /api/attempts ──► Returns { id, status: 'pending' } immediately
       │
       ▼
[Navigates to /attempts/:id]
       │
       ├─► Polling GET /api/attempts/:id every 2s
       │   (status: 'pending' → 'evaluating' → 'completed')
       │
       ▼
[Renders Feedback View (Score, Strengths, Improvements, SOLID Principles Table)]
```

---

## 3. Key Classes & Interfaces

### Domain Models (`server/src/domain/`)

- **`Problem`**: Represents an LLD scenario.
  ```typescript
  export interface Problem {
    id: string;
    title: string;
    description: string;
    requirements: string[];
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    examples: Example[];
  }
  ```

- **`Attempt`**: Represents a learner's submission lifecycle.
  ```typescript
  export interface Attempt {
    id: string;
    problemId: string;
    learnerId: string;
    submittedAt: string;
    solution: { type: 'text' | 'code'; content: string };
    status: 'pending' | 'evaluating' | 'completed' | 'failed';
    feedback: Feedback | null;
  }
  ```

- **`Feedback`**: Structured output of evaluation.
  ```typescript
  export interface Feedback {
    overallScore: number;
    summary: string;
    strengths: string[];
    improvements: string[];
    designPrinciples: DesignPrinciple[];
  }
  ```

- **`EvaluationStrategy`**: Pluggable evaluation contract.
  ```typescript
  export interface EvaluationStrategy {
    evaluate(problem: Problem, attempt: Attempt): Promise<Feedback>;
  }
  ```

### Service & Repository Layer (`server/src/services/`)

- **`ProblemRepository`**: Manages seeded problem entities in memory via a Map.
- **`AttemptRepository`**: Manages attempt entities and query operations (`findById`, `findByLearnerId`).
- **`AttemptService`**: Main orchestrator. Handles submission validation, persistence, and background evaluation state management.
- **`GeminiEvaluationStrategy`**: Implementation of `EvaluationStrategy` leveraging Google Gemini SDK with fallback model resilience.
- **`MockEvaluationStrategy`**: Offline strategy used during development and fallback scenarios.

---

## 4. Architectural Decisions & Rationale

### Why Strategy Pattern for Evaluation?
Evaluating software design solutions is inherently non-deterministic. By defining `EvaluationStrategy` as an interface, the service layer relies on an abstraction rather than a concrete LLM vendor. 
- **Extensibility**: We can swap `GeminiEvaluationStrategy` for OpenAI, Anthropic, or a custom fine-tuned model without altering a single line of `AttemptService`.
- **Testability**: Unit tests use `jest.fn()` mocks of `EvaluationStrategy`, allowing fast, deterministic test runs without external API dependencies.

### Why Asynchronous Fire-and-Forget Evaluation?
LLM generation latency ranges from 2 to 6 seconds. A synchronous request model holding open HTTP connections creates:
1. High risk of gateway timeouts.
2. Poor UI responsiveness.
3. High server resource lockup under concurrent load.

`AttemptService.createAttempt` persists the attempt with status `'pending'`, returns `{ id, status: 'pending' }` instantly, and fires `evaluateInBackground()` without awaiting it. The client polls the status endpoint until evaluation completes.

---

## 5. Trade-offs & Future Improvements

1. **In-Memory Map Storage**:
   - *Trade-off*: Fast development with zero database setup overhead vs. loss of data on server restart.
   - *Future Plan*: Implement `SqliteAttemptRepository` or `MongoAttemptRepository` implementing the same repository interfaces.

2. **Client-Side Polling vs. WebSockets / SSE**:
   - *Trade-off*: 2-second HTTP polling is simple, stateless, and firewall-friendly vs. slight overhead of repeated HTTP headers.
   - *Future Plan*: Migrate to Server-Sent Events (SSE) for instant completion notifications.

3. **Single Hardcoded User (`user-1`)**:
   - *Trade-off*: Deferred authentication complexity to focus on core evaluation UX.
   - *Future Plan*: Add JWT/OAuth authentication middleware.

