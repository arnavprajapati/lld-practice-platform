# AI Usage Documentation

## Overview of AI Usage

This project leveraged AI in two distinct capacities:
1. **Google Gemini (free tier)** as an automated runtime evaluator for student LLD submissions.
2. **Claude (Anthropic) via Cursor** as a pair programmer for scaffolding, refactoring, and code review.

---

## 5 Meaningful AI Decisions & Engineering Trade-offs

### Decision 1: Strategy Pattern for AI Evaluation Engine
- **What AI Suggested**: Originally, the AI suggested calling the Gemini API directly inside an Express route handler or `AttemptService`.
- **Accepted / Rejected**: **Rejected** inline API calls; **Accepted** creating an `EvaluationStrategy` interface.
- **Why**: Calling LLM APIs directly inside service logic creates tight coupling and makes unit testing impossible without live API keys. By introducing `EvaluationStrategy`, we created `MockEvaluationStrategy` for unit tests and `GeminiEvaluationStrategy` for runtime execution. `AttemptService` receives the strategy via constructor injection, enabling effortless provider swaps (e.g. to Claude or GPT-4) in the future.

### Decision 2: Async Background Evaluation vs. Synchronous Blocking HTTP
- **What AI Suggested**: The AI initially generated a synchronous handler where `POST /api/attempts` waited for `await evaluator.evaluate()` before responding to the user.
- **Accepted / Rejected**: **Rejected**.
- **Why**: LLM evaluations can take 2–6 seconds depending on API latency and quota limits. Holding an HTTP request open causes UI freeze, timeout risk, and poor user experience. We refactored `POST /api/attempts` to return `id` and status `'pending'` immediately, while running evaluation asynchronously in the background. The client polls `GET /api/attempts/:id` every 2 seconds until the status reaches `'completed'` or `'failed'`.

### Decision 3: Single-Instance GenerativeModel Initialization with Fallback
- **What AI Suggested**: The AI initially wrote code that called `new GoogleGenerativeAI(apiKey).getGenerativeModel(...)` inside every `evaluate()` method call, hardcoded strictly to `"gemini-1.5-flash"`.
- **Accepted / Rejected**: **Modified**.
- **Why**: Re-instantiating SDK objects per request adds unnecessary overhead. Furthermore, hardcoded model names failed with `404 Not Found` on certain Gemini v1beta endpoints. We moved SDK initialization to the constructor and added an automatic fallback chain (`gemini-2.5-flash` → `gemini-2.0-flash` → `gemini-1.5-flash-latest`), ensuring high availability and resilience across API updates.

### Decision 4: Output Sanitization & Markdown Fence Removal
- **What AI Suggested**: AI suggested trusting Gemini's JSON output directly from `result.response.text()`.
- **Accepted / Rejected**: **Rejected**.
- **Why**: LLMs frequently wrap JSON in markdown code blocks (` ```json ... ``` `) or include raw markdown formatting like `**text**` inside string values. Passing raw text directly to `JSON.parse` caused parser exceptions. We implemented a multi-stage sanitizer: (1) stripping markdown code fences before parsing, (2) clamping scores into a valid `0–100` numeric range, and (3) stripping raw `**` bold syntax from feedback strings on both server and client.

### Decision 5: Dependency Composition Root
- **What AI Suggested**: The initial AI boilerplate instantiated repositories, services, controllers, and Express routes all inside a single `index.ts` file.
- **Accepted / Rejected**: **Rejected**.
- **Why**: Monolithic entry files make modular testing and clean architecture difficult. We separated the entry point into `app.ts` (Express routing and middleware), `config/dependencies.ts` (the dependency composition root), and `index.ts` (server startup and environment configuration).

---

## Summary Table

| Decision Area | AI Initial Suggestion | Human Action | Rationale |
|---|---|---|---|
| Evaluation Interface | Direct API call in service | Created `EvaluationStrategy` interface | Decouples LLM provider; enables mock testing |
| API Responsiveness | Blocking synchronous HTTP | Asynchronous fire-and-forget + polling | Prevents HTTP timeouts; responsive UX |
| Model Initialization | Per-request init & hardcoded model | Single init in constructor + model fallback | Performance optimization & endpoint resilience |
| Response Sanitization | Trust raw JSON string | Multi-stage fence stripping & string formatting | Eliminates JSON parse errors & UI artifacts |
| Project Structure | All-in-one `index.ts` | Separated `app.ts`, `dependencies.ts`, `index.ts` | Clean layered architecture & testability |
