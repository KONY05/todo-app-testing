# AI Workflow Rules

## Approach
Build incrementally with a spec-driven methodology. Define what a feature should do in the project overview and context files before writing implementation code. Prefer small, focused changes over large rewrites.

## Scoping Rules
1. Work on one feature or fix at a time — do not mix unrelated changes in a single commit.
2. Keep each change small enough to describe in a single commit message.
3. Verify each change independently (build, lint, typecheck) before moving on.

## When To Split Work
- A task involves more than two files being changed
- A feature touches both the UI and data layer
- A change includes both new code and documentation updates
- The scope expands beyond the originally intended feature boundary

## Handling Missing Requirements
1. If a requirement is ambiguous, make the most conservative, safe choice and document the assumption in `context/progress-tracker.md`.
2. Do not add features or behaviors not explicitly requested — defer to the backlog.
3. If the user's request conflicts with an existing design decision in the context files, raise the conflict before acting.

## Package / Module Boundaries
- `src/App.tsx` owns all task state and rendering logic. Do not import task-related state from other files unless a new module has been explicitly created for it.
- `src/main.tsx` is the entry point only — do not add business logic there.
- `src/index.css` defines global styles and theme variables. Do not override CSS custom properties per-component without a documented reason.

## Protected Foundation Components
- `vite.config.ts` — Vite build configuration, do not modify without explicit instruction
- `tsconfig.json` and `tsconfig.app.json` — TypeScript configuration, do not modify without explicit instruction
- `index.html` — HTML entry point, do not modify without explicit instruction
- `eslint.config.js` — linting configuration, do not modify without explicit instruction

## Keeping Docs In Sync
- When implementation changes the architecture, scope, or commands, update the relevant context file before continuing.
- After each meaningful implementation change, update `context/progress-tracker.md`.
- If a context file contradicts what the code actually does, the code is the source of truth — update the doc to match.

## Before Moving To The Next Feature
1. Build passes (`npm run build`) without errors
2. Lint passes (`npm run lint`) without errors
3. TypeScript typecheck passes (`npx tsc --noEmit`) without errors
4. The feature works as described in the project overview
5. `context/progress-tracker.md` has been updated with the completed work
