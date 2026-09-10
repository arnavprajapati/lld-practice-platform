# Research Note: Low-Level Design (LLD) Practice & Evaluation Platform

## 1. Executive Summary

Low-Level Design (LLD), also known as Object-Oriented Design (OOD), is a critical evaluation component in software engineering technical interviews, particularly for Mid to Senior level positions at product-based companies. While platforms like LeetCode and HackerRank have standardized High-Level System Design (HLD) and Data Structures & Algorithms (DSA) preparation, LLD practice remains fragmented, passive, and unguided.

This document details the learner problem space, analyzes existing market offerings, highlights critical product gaps, and defines the product vision for the **LLD Practice Platform**.

---

## 2. Learner Problem Space

Engineers preparing for LLD interviews face three primary obstacles:

1. **Lack of Automated, Immediate Feedback**:
   Unlike DSA where unit tests give instant pass/fail validation, LLD solutions are open-ended class diagrams, schema designs, and code contracts. Learners write solutions in text editors or whiteboards without knowing if their design violates SOLID principles or misses edge cases.

2. **Passive Consumption vs. Active Practice**:
   Most LLD resources consist of static articles, YouTube videos, or pre-written GitHub repositories (e.g., "Parking Lot System Solution in Java"). Learners passively read code rather than actively designing systems under constraints, creating a false sense of mastery.

3. **Ambiguous Design Rubrics**:
   Interviewers evaluate candidates on specific criteria: Single Responsibility, Open/Closed extensibility, proper encapsulation, data structure selection, and concurrency handling. Without structured feedback mapped directly to these principles, candidates cannot identify specific weaknesses in their design approach.

---

## 3. Existing Tools & Market Analysis

| Platform / Tool | Core Format | Major Strengths | Critical Gaps |
|---|---|---|---|
| **LeetCode (DSA Focus)** | Code submission against unit test cases | Instant automated feedback, execution environment, massive problem set | Incapable of evaluating design abstraction, interface segregation, or architectural trade-offs. |
| **Educative.io ("Grokking LLD")** | Text-based interactive reading courses | Comprehensive problem statements, reference code, UML diagrams | Entirely passive. No automated evaluation of user-written designs; static reference solutions only. |
| **YouTube / GitHub Repos** | Free video walkthroughs and static repos | Free accessibility, diverse solution styles | One-way communication. No interactive practice environment or feedback on learner drafts. |
| **Mock Interviews (Pramp / Interviewing.io)** | Human peer or interviewer practice | Realistic interview pressure, qualitative human feedback | Expensive ($100–$200/session), non-scalable, scheduling friction, inconsistent interviewer quality. |

---

## 4. Product Direction & Vision

The **LLD Practice Platform** bridges the gap between passive reading and expensive human mock interviews by combining **interactive design problem scenarios** with **automated AI-driven architectural feedback**.

### Core Value Propositions:
1. **Scenario-Based Real-World Problems**:
   Problems are presented with clear requirements, behavioural examples, and difficulty tags (e.g., Parking Lot, Library Management, Swiggy-like Food Delivery).

2. **Flexible Submission Format**:
   Learners can submit solutions in plain text/prose (explaining entity relationships and responsibilities) or actual code (Java, C++, TypeScript).

3. **Structured Design Principle Scoring**:
   Instead of a generic pass/fail, the platform evaluates solutions against five core design dimensions:
   - **Single Responsibility Principle (SRP)**
   - **Open/Closed Principle (OCP)**
   - **Appropriate Abstraction & Interfaces**
   - **Encapsulation & State Protection**
   - **Concurrency & Edge-Case Safety**

4. **Actionable Improvement Roadmap**:
   Every evaluation returns a numerical score (0–100), concise summary verdict, bulleted strengths, actionable improvements, and a principle-by-principle audit table.

---

## 5. Strategic Roadmap

- **Phase 1 (Current MVP)**: In-memory REST API, React monochrome developer UI, Gemini AI evaluation strategy, 3 core seeded problems.
- **Phase 2**: Interactive Class Diagram / UML visual editor integrated alongside text/code editor.
- **Phase 3**: User accounts, persistence database, custom user-submitted problem community.

