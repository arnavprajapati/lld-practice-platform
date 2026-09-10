# AI Usage Documentation

## Tools Used

- **Google Gemini (free tier)** — Runtime LLD solution evaluator. Uses model fallback (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash-latest`) to generate structured JSON feedback with scores, strengths, improvements, and design principle analysis.
- **Claude (Anthropic) via Cursor** — Used for scaffolding the monorepo, writing domain models, repositories, services, controllers, routes, API client, and React frontend components.

## Key Decisions

### 1. Strategy Pattern for Evaluation
Used the `EvaluationStrategy` interface so the evaluator is injectable via constructor. Started with `MockEvaluationStrategy` (hardcoded feedback, 2s delay), then swapped to `GeminiEvaluationStrategy` — zero changes to `AttemptService`. This makes switching to GPT-4 or Claude trivial later.

### 2. Gemini Free Tier with Automatic Model Fallback
Chose the free tier intentionally — this is a learning/practice platform, not production. Implemented an automatic model fallback mechanism (`gemini-2.5-flash` → `gemini-2.0-flash` → `gemini-1.5-flash-latest`) to ensure resilience against regional or API version model availability changes.

### 3. Async Fire-and-Forget Evaluation
`POST /api/attempts` returns immediately with `status: 'pending'`. Evaluation runs in the background (`pending → evaluating → completed/failed`). The client polls `GET /api/attempts/:id` every 2 seconds. This keeps the UX responsive with no blocking HTTP requests.

### 4. In-Memory Storage over Database
No database — just Map instances in repository classes (`ProblemRepository`, `AttemptRepository`). For a practice platform with a single hardcoded user (`user-1`), persistence isn't needed. Data reseeds on restart, and the service layer is decoupled from the storage mechanism.

### 5. Thin Controllers, Fat Services
Controllers only handle HTTP concerns (parse request, validate input, return HTTP status). All business logic lives in `AttemptService`. This keeps the architecture clean, decoupled, and easy to unit test without Express overhead.

## What I Accepted / Rejected and Why

### Accepted
- **AI-generated domain models** — `Problem`, `Attempt`, `Feedback`, `EvaluationStrategy` interfaces. They matched the specification exactly.
- **AI-generated seed data** — 3 LLD problems (Parking Lot, Library, Food Delivery) with realistic requirements and examples. Saved time while keeping content realistic.
- **AI-generated project structure** — `domain/`, `services/`, `controllers/`, `routes/` separation. Standard layered architecture.
- **AI-generated Tailwind design system** — Monochrome design tokens (`canvas`, `ink`, `muted`, `line`), consistent radius/shadow scale, clean developer-tool aesthetic.

### Rejected / Modified
- **AI initially put all wiring in `index.ts`** — Moved dependency composition to `config/dependencies.ts` and Express setup to `app.ts` for clean separation of concerns.
- **AI initialized Gemini client inside every `evaluate()` call** — Refactored SDK initialization to reuse the client instance and added fallback model handling.
- **AI left raw markdown bold syntax (`**`) in AI feedback strings** — Added string sanitization in both `GeminiEvaluationStrategy` and frontend `AttemptStatus` to strip `**` tags for clean UI rendering.
- **AI used `var()` CSS syntax in JSX** — Replaced `bg-[var(--color-canvas)]` with native Tailwind v4 theme utilities (`bg-canvas`, `text-ink`) for idiomatic code.
