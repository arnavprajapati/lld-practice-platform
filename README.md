# LLD Practice Platform

A monorepo web platform for software engineers to practice Low-Level Design (LLD) problems. Learners can select concrete design problems, draft text or code implementations, and receive automated, structured AI feedback evaluating their design against core object-oriented principles.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, React Router v6
- **Backend**: Node.js, Express, TypeScript, `@google/generative-ai` SDK
- **Testing**: Jest, `ts-jest`
- **AI Evaluator**: Google Gemini 1.5 Flash (Free Tier) with automatic model fallback

## How to Run Locally

### Prerequisites
- Node.js 18+ and `npm` installed
- A Google Gemini API Key (get one for free at [aistudio.google.com](https://aistudio.google.com))

### Step 1: Clone and Set Up Server Environment
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=4000
```

### Step 2: Start the Server
```bash
npm run dev
# Server starts at http://localhost:4000
```

### Step 3: Run Server Unit Tests
```bash
npm test
# Runs 12 Jest unit tests for repositories, service logic, and error scenarios
```

### Step 4: Start the Client
Open a new terminal window:
```bash
cd client
npm install
npm run dev
# Client starts at http://localhost:5173
```

---

## Project Structure

```
lld-practice-platform/
├── client/                     # React + TypeScript + Vite + Tailwind frontend
│   ├── src/
│   │   ├── lib/api.ts          # API fetch client wrapper
│   │   ├── pages/              # SPA pages (Home, ProblemDetail, AttemptStatus, History, NotFound)
│   │   └── types.ts            # Client domain type definitions
├── server/                     # Express + TypeScript backend
│   ├── src/
│   │   ├── domain/             # Problem, Attempt, Feedback, EvaluationStrategy interfaces
│   │   ├── services/           # ProblemRepository, AttemptRepository, AttemptService, GeminiEvaluationStrategy
│   │   ├── controllers/        # Thin HTTP controllers (ProblemController, AttemptController)
│   │   ├── routes/             # Express routes (problemRoutes, attemptRoutes)
│   │   ├── config/             # Dependency injection container (dependencies.ts)
│   │   └── __tests__/          # Jest unit test suite
│   ├── .env                    # Environment secrets (GEMINI_API_KEY)
│   └── jest.config.js          # Jest configuration
├── README.md                   # Setup guide and technical overview
├── AI_USAGE.md                 # Documentation of AI tools and engineering decisions
├── research-note.md            # Market research on LLD practice gaps & product vision
└── design-note.md              # System design architecture, data flow & trade-offs
```

---

## Key Design Decisions

1. **Pluggable EvaluationStrategy Pattern**:
   The evaluation logic is decoupled behind the `EvaluationStrategy` interface. `AttemptService` accepts the strategy via constructor injection. Swapping between `MockEvaluationStrategy` (for offline testing) and `GeminiEvaluationStrategy` required zero changes to business logic or controllers.

2. **Asynchronous Fire-and-Forget Evaluation**:
   `POST /api/attempts` persists the attempt with status `'pending'` and immediately returns the ID to the client. Evaluation runs asynchronously in the background (`pending` → `evaluating` → `completed`/`failed`), and the client polls `GET /api/attempts/:id` every 2 seconds. This prevents HTTP request timeouts when calling LLM APIs.

3. **In-Memory Map Repositories**:
   Data storage uses thread-safe TypeScript `Map` data structures in `ProblemRepository` and `AttemptRepository`. This satisfies the lightweight MVP requirement without requiring database overhead, while isolating persistence behind repository interfaces.

---

## Known Limitations

- **In-Memory Storage Persistence**: Data resets when the server process restarts. Persistent database integration (e.g. PostgreSQL or MongoDB) can be added by implementing database-backed repository classes.
- **Single Learner Context**: Currently hardcoded to `learnerId: "user-1"`. Multi-tenant authentication (JWT/OAuth) is deferred to future iterations.
- **Rate Limits**: Free-tier Gemini API calls may experience rate limits under high concurrency.
