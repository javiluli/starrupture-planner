# Project Structure

This project follows a feature-first structure for product pages and a shared layer for cross-cutting UI and utilities.

## Top-Level Overview

```
src/
  assets/          # Static images and brand assets
  features/        # Feature modules grouped by product area
  layouts/         # App layout shells (Navbar, page wrappers)
  pages/           # Route-level screens that compose features
  router/          # Route config and navigation
  shared/          # Cross-feature UI, utilities, i18n, and types
  store/           # Global state (Zustand stores)
```

## Features

Each feature folder owns its UI, logic, and hooks. Keep components close to their domain.

```
src/features/
  planner/
    core/          # Domain logic and calculations
    flow/          # React Flow diagrams and layout helpers
    hooks/         # Feature-specific hooks
    ui/            # Planner UI components
      controls/
      sidebar/
      stats/
  items/
    core/          # Filtering and domain helpers
    hooks/         # Feature-specific hooks
    ui/            # Filters and table components
      filters/
      table/
  sketch/          # Experimental / in-progress feature
```

## Shared Layer

Reusable code that is not tied to a specific feature lives in `shared/`.

```
src/shared/
  i18n/            # UI translations and game data translations
    ui/            # UI copy translations (en/es)
    game-data/     # Game data translations (en/es)
  ui/              # Reusable UI building blocks
  utils/           # Cross-feature helpers
  types/           # Shared TypeScript types
```

## Pages and Layouts

- `pages/` are route-level screens that compose features and layout pieces.
- `layouts/` contains the root layout and shared shells.

## Router

`router/` contains route definitions and the router setup.

---

# Conventions

- **Feature-first**: Keep feature logic, hooks, and UI inside its feature.
- **Shared stays generic**: If a component or helper is used in multiple features, it belongs in `shared/`.
- **Pages compose**: Pages should stitch together feature components and avoid heavy logic.
- **Naming**: Use descriptive component names that match their role in the UI (avoid redundant prefixes).
