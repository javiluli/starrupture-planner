# Repository Guidelines

## Project Structure & Module Organization

This Vite, React, and TypeScript application follows a feature-first structure. Route-level composition belongs in `src/pages/`, while product code lives in `src/features/<feature>/` (currently `planner`, `items`, `recipes`, and `corporations`). Keep feature-specific UI, hooks, types, and pure logic inside that feature. Put reusable components and helpers in `src/shared/`; reserve `src/lib/` for logic genuinely shared across features. Zustand stores live in `src/store/`, routing in `src/router/`, and application shells in `src/layouts/`. Game data is stored in `src/shared/data/`. Catalog icons live in `public/assets/icons/` so `AssetImage` can load them on demand; other public static files remain in `public/`.

## Build, Test, and Development Commands

Use `pnpm` and commit changes to `pnpm-lock.yaml` when dependencies change.

- `pnpm dev`: start the Vite development server.
- `pnpm build`: type-check with TypeScript and create the production bundle.
- pnpm lint: run ESLint across TypeScript and React files.
- pnpm test: run component and unit tests once with Vitest.
- `pnpm preview`: serve the production build locally.
- `pnpm copy:fonts`: refresh the local Geist font assets.

## Coding Style & Naming Conventions

Prettier is the formatting source of truth: two spaces, single quotes, no semicolons, trailing commas, and a 140-character line limit. Use function components and TypeScript types for public contracts. Name files in kebab-case (`production-flow-diagram.tsx`), components in PascalCase, hooks with `use-`, stores as `*.store.ts`, and type modules as `*.types.ts`. Pages should compose ready-to-use feature components; calculations belong in feature `lib/` modules and global client state in Zustand stores. Prefer HeroUI components for UI and Tailwind utilities for focused layout adjustments.

## Testing Guidelines

Vitest and Testing Library cover component and unit behavior. Colocate focused tests with their owner: `src/shared/ui/asset-image/asset-image.test.tsx` is the reference pattern. Keep feature tests inside their feature and reserve a future root `e2e/` directory for browser journeys. Run `pnpm test`, `pnpm lint`, and `pnpm build`; manually verify affected routes when behavior or layout changes.

## Commit & Pull Request Guidelines

The current history uses short, direct commit messages rather than Conventional Commits (for example, `mejoras#2`). Prefer a clearer imperative summary such as `Refine planner building variants`, and keep each commit focused on one concern. Pull requests should describe the affected features, behavior changes, validation performed, and any data migrations. Include screenshots or recordings for UI changes and link related issues when available.
