# AI Usage Documentation

## Tools Used

- **Google Gemini 1.5 Flash (free tier)** — Runtime LLD solution evaluator. Receives structured prompts, returns JSON feedback with scores, strengths, improvements, and design principle analysis.
- **Claude (Anthropic) via Cursor** — Used for scaffolding the monorepo, writing domain models, services, controllers, routes, and frontend components.

## Key Decisions

### 1. Strategy Pattern for Evaluation
Used the `EvaluationStrategy` interface so the evaluator is injectable via constructor. Started with `MockEvaluationStrategy` (hardcoded feedback, 2s delay), then swapped to `GeminiEvaluationStrategy` — zero changes to `AttemptService`. This makes switching to GPT-4 or Claude trivial later.

### 2. Gemini 1.5 Flash over Paid APIs
Chose the free tier intentionally — this is a learning/practice tool, not production. The structured JSON prompt gives consistent enough output for feedback. If quality needs to improve, swap the strategy implementation; the interface stays the same.

### 3. Async Fire-and-Forget Evaluation
`POST /api/attempts` returns immediately with `status: 'pending'`. Evaluation runs in the background (`pending → evaluating → completed/failed`). The client polls `GET /api/attempts/:id`. This keeps the UX responsive — no blocking HTTP request waiting on Gemini.

### 4. In-Memory Storage over Database
No database — just Maps in repository classes. For a practice platform with a single hardcoded user (`user-1`), persistence isn't needed. Data reseeds on restart. If we need persistence later, swap `ProblemRepository` / `AttemptRepository` implementations — the service layer doesn't care.

### 5. Thin Controllers, Fat Services
Controllers only handle HTTP concerns (parse request, validate input, send response). All business logic lives in `AttemptService`. This keeps the architecture testable — you can unit test the service without Express.

## What I Accepted / Rejected and Why

### Accepted
- **AI-generated domain models** — `Problem`, `Attempt`, `Feedback`, `EvaluationStrategy` interfaces. They matched exactly what the requirements specified. No reason to rewrite.
- **AI-generated seed data** — 3 LLD problems (Parking Lot, Library, Food Delivery) with realistic requirements and examples. Saved time, content was accurate.
- **AI-generated project structure** — `domain/`, `services/`, `controllers/`, `routes/` separation. Standard layered architecture, nothing to argue with.
- **AI-generated Tailwind design system** — Monochrome tokens (`canvas`, `ink`, `muted`, `line`), consistent radius/shadow scale. Clean and cohesive.

### Rejected / Modified
- **AI initially put all wiring in `index.ts`** — Moved dependency composition to `config/dependencies.ts` and Express setup to `app.ts`. Cleaner separation, easier to test.
- **AI initialized Gemini client inside every `evaluate()` call** — Moved `GoogleGenerativeAI` and model initialization to the constructor. One instance, reused across calls. No reason to create a new SDK client per request.
- **AI used `var()` CSS syntax in JSX** — Replaced `bg-[var(--color-canvas)]` with native Tailwind v4 theme utilities (`bg-canvas`, `text-ink`). Cleaner, more idiomatic Tailwind.
- **AI named the tool "Google Antigravity"** — Changed to "Claude (Anthropic) via Cursor" because that's what it actually is. Evaluators will check this.
