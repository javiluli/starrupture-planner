# Router Structure

This folder encapsulates routing concerns.

## Files

- `routes.ts`: neutral path constants and primary-navigation metadata; it does not import layouts, pages or JSX.
- `router.tsx`: React Router configuration, lazy page elements and route tree.

## Error handling

The root layout remains mounted for every route state. The nested route boundary renders `NotFound` only for real 404 responses; unexpected loader or render failures use `RouteError` with retry and home actions. The wildcard route also renders `NotFound`, so an unknown URL keeps the primary navigation and `<main>` landmark.

## Usage

Import the router only at the application entry. Layouts and features consume `routes.ts`; they must not import `router.tsx`. This keeps the dependency direction `router -> layout -> route metadata` and prevents a router/layout cycle.
