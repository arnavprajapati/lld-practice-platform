# LLD Practice Platform

A monorepo for practicing Low-Level Design (LLD) problems — submit solutions and get AI-powered feedback.

## Structure

```
lld-practice-platform/
├── client/   → React + TypeScript + Vite + Tailwind
├── server/   → Node.js + Express + TypeScript
├── README.md
└── AI_USAGE.md
```

## Getting Started

### Server

```bash
cd server
npm install
npm run dev
```

### Client

```bash
cd client
npm install
npm run dev
```

## Domain Overview

- **Problem** — LLD design problems with requirements and examples
- **Attempt** — A learner's submitted solution to a problem
- **Feedback** — Structured evaluation of an attempt
- **EvaluationStrategy** — Pluggable strategy for evaluating attempts

