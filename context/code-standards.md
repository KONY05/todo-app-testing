# Code Standards

## General
- Keep modules focused: each file should have a single clear responsibility. App.tsx contains the main component; split out helpers (e.g., storage, filtering) when they grow beyond ~50 lines.
- Use error handling for local storage operations — wrap `JSON.parse` and `localStorage` access in try/catch and return safe defaults on failure.
- Do not reach across module boundaries to access state directly; pass data via props or shared hooks.
- Avoid hardcoded secrets or API keys in source files — removed from the codebase and replaced with environment variable patterns where needed.

## TypeScript
- Use `interface` for object types (e.g., `Todo`) and `type` for unions and primitives (e.g., `Filter`).
- Prefer strict null checks — use explicit `null` checks rather than falsy coercion for IDs and optional fields.
- Type all function parameters and return values explicitly; avoid implicit `any`.
- Use `const` for event handlers and callbacks to avoid unnecessary re-renders where the identity matters (e.g., memoized values).

## React / Vite
- Use functional components with hooks (`useState`, `useEffect`, `useMemo`).
- Keep component logic cohesive — extract sub-handlers as named functions within the component rather than inline arrow functions where they are reused or complex.
- Use `FormEvent<HTMLFormElement>` for form submission handlers and always call `event.preventDefault()`.
- Use semantic HTML elements (`<main>`, `<header>`, `<section>`, `<footer>`, `<ul>`, `<li>`) and ARIA attributes (`aria-label`, `aria-pressed`, `aria-live`) for accessibility.
- CSS is scoped to the component via class names using BEM-like conventions (`app__header`, `todo-item`, `filter-button.is-active`).

## Styling
- Primary styles live in `src/index.css`; component-specific overrides live in `src/App.css` (currently largely the Vite template boilerplate).
- Use CSS custom properties (`--bg`, `--accent`, `--border`, etc.) for theming and mode support.
- Respect `color-scheme: light` / `color-scheme: dark` for native form element styling.

## File Organization
- `src/App.tsx` — main application component and all task logic
- `src/main.tsx` — entry point that mounts the React app
- `src/index.css` — global styles, CSS custom properties, theme definitions
- `src/App.css` — component-specific styles (mostly Vite template boilerplate)
- `src/assets/` — static assets (images, icons)
- `context/` — project documentation for AI agents and contributors
- `public/` — static public assets served as-is
- `dist/` — build output (not tracked in source control)
