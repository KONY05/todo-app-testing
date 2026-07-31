# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Application Building Context
Read the following files in order before implementing or making any architectural decision:

1. `context/project-overview.md` — product definition, goals, features, and scope
2. `context/code-standards.md` — implementation rules and conventions
3. `context/ai-workflow-rules.md` — development workflow, scoping rules, and delivery approach
4. `context/progress-tracker.md` — current phase, completed work, open questions, and next steps

Update `context/progress-tracker.md` after each meaningful implementation change.

If implementation changes the architecture, scope, or standards documented in the context files, update the relevant file before continuing.

## What This Is
A Vite-powered React + TypeScript todo application for managing personal tasks in the browser. Tasks persist via local storage, and the app supports filtering, search, inline editing, importance marking, and light/dark mode.

## Monorepo / Package Structure
Single-package project — no monorepo structure.

| Path | Purpose |
|------|---------|
| `src/App.tsx` | Main application component with all task logic |
| `src/main.tsx` | React entry point |
| `src/index.css` | Global styles and theme definitions |
| `src/App.css` | Component-specific styles (largely Vite template boilerplate) |
| `src/assets/` | Static assets |
| `context/` | Project documentation for AI agents and contributors |
| `public/` | Static public assets |
| `dist/` | Build output |

## Commands
```sh
npm install          # Install dependencies
npm run dev          # Start the Vite dev server (usually http://localhost:5173)
npm run build        # Type-check and build for production
npm run preview      # Preview the production build locally
npm run lint         # Run ESLint
```

## Environment Setup
No environment variables or secret keys are required. The app runs entirely in the browser with no backend. Local storage is used for data persistence automatically.

## Architecture
### Entry Point
- `src/main.tsx` — mounts `<App />` into the DOM via `createRoot`

### Main Component
- `src/App.tsx` — single-file component managing:
  - `todos` state array (with `id`, `text`, `completed`, `createdAt`, `important`)
  - `filter` state (all / active / completed)
  - `search` state (text filter)
  - `editingId` and `editText` state (inline editing)
  - `draft` state (new task input)
  - localStorage persistence via `useEffect`
  - Derived `counts` and `visibleTodos` via `useMemo`

### Styling
- `src/index.css` — CSS custom properties for theming, global layout
- `src/App.css` — component-specific styles (mostly Vite template boilerplate)

## Key Design Decisions
- **Single-file component**: All task logic lives in `App.tsx`; no sub-components or context providers yet — this keeps the app simple for its current scope.
- **Local storage persistence**: Tasks survive page reloads without a backend. Data is serialized as JSON under the key `vite-react-todos`.
- **Inline editing**: Tasks are edited in-place via double-click, avoiding modal dialogs or extra screens.
- **CSS custom properties for theming**: `color-scheme: light dark` drives native form element styling, while custom properties control app-specific colors.
- **No external state management**: React `useState`/`useMemo` is sufficient for the current feature set; no Redux, Zustand, or similar.
