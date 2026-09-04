# Router Structure

This folder encapsulates routing concerns.

## Files

- `routes.ts`: neutral path constants and primary-navigation metadata; it does not import layouts, pages or JSX.
- `router.tsx`: React Router configuration, lazy page elements and route tree.

## Usage

Import the router only at the application entry. Layouts and features consume `routes.ts`; they must not import `router.tsx`. This keeps the dependency direction `router -> layout -> route metadata` and prevents a router/layout cycle.
