# Project Structure

The repository follows a feature-first architecture. Product-specific code stays close to its feature; only genuinely cross-feature primitives belong in `shared/`.

```text
src/
|- assets/       # Bundled icons and visual assets
|- features/     # Planner, Items, Recipes and Corporations
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

## Bundle Policy

Route pages are loaded with `React.lazy`; keep page-only dependencies behind that boundary. Continue importing supported components from `@heroui/react`: its package is tree-shakeable and the production source map confirms that only used HeroUI component packages enter each chunk. Do not import undeclared transitive `@heroui/*` packages or add `manualChunks` only to hide Vite's size warning; either change requires a measured reduction in initial gzip size.

Current production baseline: the entry chunk is about `685 kB` raw / `194 kB` gzip. Most mapped bytes come from React DOM, HeroUI Theme, React Router and React Aria rather than application code.

## Naming

- Components and files describe UI roles: `ItemsTable`, `PlannerToolbar`, `PlannerSidebar`.
- Hooks describe their result/action: `useItemsTableRows`, `useOpenPlanner`.
- Builders describe their output: `buildItemsTableRows`, `buildProductionPlan`.
- Avoid aliases during renames; update symbols, files, imports and barrels together.
