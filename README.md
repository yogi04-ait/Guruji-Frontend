# Guruji-Frontend

Frontend for Guruji Job Consultancy — a responsive React + Vite application.

## Project overview

This repository contains the frontend application for Guruji Job Consultancy. It provides public pages (home, about, services, industries, hiring listings, contact) and an admin dashboard for managing job listings, applicants, enquiries, and testimonials.

## Frontend architecture

- React + TypeScript with Vite
- Routing: `@tanstack/react-router`
- UI: Tailwind CSS utility classes and a small design system inside `src/components`
- Icons: `lucide-react`
- Toasts: `sonner`

## Tech stack

- Node.js / Bun compatible (project uses `bun` in tooling)
- React
- TypeScript
- Vite
- Tailwind CSS

## Installation

1. Install dependencies (choose your package manager):

```bash
# Using bun
bun install

# Or using npm
npm install

# Or using pnpm
pnpm install
```

2. Start development server:

```bash
# Bun
bun dev

# npm
npm run dev
```

## Environment variables

- The project expects any API base URLs or secrets to be configured via the environment or a separate config. Check `src/lib/api.ts` for integration points.

## Available scripts

Check `package.json` for scripts. Typical commands:

- `dev` — start dev server
- `build` — create production build
- `preview` — preview production build
- `test` — run tests (if configured)

## Build & deploy

Build for production:

```bash
npm run build
```

Then serve the `dist` output with a static server or integrate with your deployment platform.

## API integration overview

The frontend uses a thin `api` client in `src/lib/api.ts` wrapping backend endpoints. The UI expects the existing request/response shapes — do not change API calls without coordinating backend changes.

## Folder structure

- `src/` — application source code
  - `components/` — shared UI components and design system
  - `routes/` — route components
  - `lib/` — utilities and `api` client
  - `assets/` — static assets

## Performance & maintainability notes

During a focused review I applied lightweight, non-breaking improvements to reduce re-renders and improve mobile UX. Suggested next steps:

- Add memoization (`React.memo`, `useMemo`, `useCallback`) to frequently re-rendering components that receive stable props.
- Avoid creating inline objects/handlers as props (use `useMemo` / `useCallback`).
- Consider lazy-loading non-critical routes/components using `React.lazy` + `Suspense`.
- Audit large lists for virtualization (e.g., `react-window`) if datasets grow large.
- Remove unused imports and dead code where safe.

## Testing

- E2E tests available under `tests/`.

## Contact

For backend API contracts and changes, coordinate with the backend team to avoid breaking integration.
