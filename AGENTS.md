# Repository Guidelines

## Project Structure & Module Organization

This Vite, React, and TypeScript application follows a feature-first structure. Route-level composition belongs in `src/pages/`, while product code lives in `src/features/<feature>/` (currently `planner`, `items`, `recipes`, `corporations`, and `base-designer`). Keep feature-specific UI, hooks, types, and pure logic inside that feature. Put reusable components and helpers in `src/shared/`; reserve `src/lib/` for logic genuinely shared across features. Zustand stores live in `src/store/`, routing in `src/router/`, and application shells in `src/layouts/`. Game data is stored in `src/shared/data/`. Catalog icons live in `public/assets/icons/` so `AssetImage` can load them on demand; other public static files remain in `public/`.

Treat each feature root `index.ts` as its public API. Consumers outside a feature must import from that API instead of reaching into private `lib/`, `hooks/`, `types/`, or `ui/` paths. Code inside a feature must use direct internal paths and never import from its own public API. Central stores may import feature-owned types and pure functions directly, but must not depend on a feature barrel or UI module.

## Build, Test, and Development Commands

Use Node.js 24.20.0 and pnpm 11.19.0, as pinned by `.nvmrc` and `package.json`. Install with `pnpm install --frozen-lockfile` and commit changes to `pnpm-lock.yaml` when dependencies change.

- `pnpm dev`: start the Vite development server.
- `pnpm build`: type-check with TypeScript and create the production bundle.
- `pnpm lint`: run ESLint across TypeScript and React files.
- `pnpm format`: format supported project files with the repository's pinned Prettier version.
- `pnpm format:check`: verify formatting without changing files.
- `pnpm test`: run component and unit tests once with Vitest.
- `pnpm typecheck:e2e`: type-check Playwright configuration and browser journeys.
- `pnpm test:e2e`: run Playwright browser journeys in Chromium.
- `pnpm test:e2e:ui`: open Playwright UI mode for local debugging.
- `pnpm test:all`: run formatting, lint, unit tests, E2E type-checking, build, and Chromium journeys.
- `pnpm preview`: serve the production build locally.

## Coding Style & Naming Conventions

Prettier is the formatting source of truth: two spaces, single quotes, no semicolons, trailing commas, and a 140-character line limit. Use function components and TypeScript types for public contracts. Name files in kebab-case (`production-flow-diagram.tsx`), components in PascalCase, hooks with `use-`, stores as `*.store.ts`, and type modules as `*.types.ts`. Pages should compose ready-to-use feature components; calculations belong in feature `lib/` modules and global client state in Zustand stores. Prefer HeroUI components for UI and Tailwind utilities for focused layout adjustments.

## Testing Guidelines

Vitest and Testing Library cover component and unit behavior. Colocate focused tests with their owner: `src/shared/ui/asset-image/asset-image.test.tsx` is the reference pattern. Playwright journeys live in `e2e/`, grouped by feature or user flow. Prefer role-based locators over CSS selectors. When no stable semantic locator exists, add `data-testid` in kebab-case using the `<feature>-<element>[-<identifier>]` pattern and query it with `getByTestId`; do not introduce DOM IDs, `data-name`, or class selectors for tests. See `e2e/README.md` for the full convention. Run `pnpm test`, `pnpm test:e2e`, `pnpm lint`, and `pnpm build` before merging behavior or layout changes.

For E2E work, use `playwright-best-practices` for test design and diagnosis, and `playwright-cli` for browser inspection or reproduction. Repository commands and conventions take precedence over generic `npx`, `npm`, Bash, locator, or execution examples from those skills.

## Protected Game Data

Editors and AI agents must not modify the four JSON catalogs in `src/shared/data/` to fix missing IDs, recipes, items, fields, or inconsistent source values: `buildings_and_recipes.json`, `buildings_construction_area.json`, `corporations_components.json`, and `items_catalog.json`. Handle incomplete data in code around the catalogs. These snapshots may be replaced separately when the game changes and the user deliberately provides or approves updated source data. See `src/shared/data/README.md` for the complete boundary.

## Commit & Pull Request Guidelines

The current history uses short, direct commit messages rather than Conventional Commits (for example, `mejoras#2`). Prefer a clearer imperative summary such as `Refine planner building variants`, and keep each commit focused on one concern. Pull requests should describe the affected features, behavior changes, validation performed, and any data migrations. Include screenshots or recordings for UI changes and link related issues when available.
