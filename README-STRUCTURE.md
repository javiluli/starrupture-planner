# Project Structure

The repository follows a feature-first architecture. Product-specific code stays close to its feature; only genuinely cross-feature primitives belong in `shared/`.

```text
public/
`- assets/       # Catalog icons and public examples loaded on demand
src/
|- features/     # Planner, Items, Recipes, Corporations and Base Designer
|- layouts/      # Root shell and navbar
|- pages/        # Route-level composition only
|- router/       # Routes, lazy loading and navigation metadata
|- shared/       # Reusable UI, static data, hooks, types and formatting
`- store/        # Todos los stores Zustand, globales y especificos de feature
```

## Feature Shape

A feature adds folders only when they contain a clear responsibility.

```text
feature/
|- hooks/        # React orchestration local to the feature
|- lib/          # Pure domain helpers
|- types/        # Feature-only contracts
|- ui/           # Feature-only components
|- index.ts      # Public API used by pages/other features
`- README.md
```

Planner additionally owns `flow/` and `providers/` because its calculated plan is shared by several visualizations.

## Import Boundaries

Feature-root `index.ts` files define public APIs for pages and other features. Inside a feature, import hooks, helpers, types and components directly from their source file. Avoid internal barrels that only forward a small number of local exports.

## Shared Rule

Move code to `src/shared/` only after it is reused by multiple features and its API is domain-neutral. Examples: `Flex`, `Panel`, `PageContainer`, `Typography`, `AssetImage`, `Accordion` and `TreeList`.

## Shell Contract

- `RootLayout` owns the viewport split between navigation and route content.
- `PageContainer` owns responsive outer padding and the gap between page regions.
- `PageHeader` owns the compact header surface and its internal padding.
- `PageContent` owns remaining height, scrolling and an optional `Panel` surface.
- Feature components own only spacing inside their own content.

## Page Rule

Pages compose existing feature components inside `PageContainer`, `PageHeader` and `PageContent`. Business calculations, filtering and store actions remain in the owning feature.

## Data Flow

Game snapshots enter through `src/shared/data/`, where they are normalized and indexed without changing the source JSON. Features combine that
read-only catalog with user-owned Zustand state, calculate derived results in pure helpers or providers, and expose ready-to-render UI through
their public API. Pages compose those APIs; the router and layouts only decide where they render.

## Bundle Policy

Route pages are normally loaded with `React.lazy`; keep page-only dependencies behind that boundary. Planner is the measured exception: its lightweight home shell loads eagerly to remove the initial route waterfall, while toolbar, diagrams and sidebar stay behind lazy boundaries exposed by the feature API. Continue importing supported components from `@heroui/react`: its package is tree-shakeable and the production source map confirms that only used HeroUI component packages enter each chunk. Do not import undeclared transitive `@heroui/*` packages or add `manualChunks` only to hide Vite's size warning; either change requires a measured reduction in initial gzip size.

Current production baseline (12 September 2026): the entry chunk is `694.03 kB` raw / `191.65 kB` gzip. The deliberate increase from the previous `177.21 kB` gzip entry removes the Planner route waterfall and, together with a deterministic preloaded marquee item, reduces median laboratory LCP from `3.676 s` to `2.400 s` on mobile. Vite still reports its generic 500 kB raw warning; add an automated gzip budget only when the product has an agreed performance SLA, rather than treating that warning as a failure by itself.

## Naming

- Components and files describe UI roles: `ItemsTable`, `PlannerToolbar`, `PlannerSidebar`.
- Hooks describe their result/action: `useItemsTableRows`, `useOpenPlanner`.
- Builders describe their output: `buildItemsTableRows`, `buildProductionPlan`.
- Avoid aliases during renames; update symbols, files, imports and barrels together.
