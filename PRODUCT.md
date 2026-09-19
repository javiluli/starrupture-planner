# Starrupture Planner

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

StarRupture players planning production for their own game. They need to inspect the machines, materials, supply, power, and heat behind a desired output rate.

## Product Purpose

Turn a target item and production rate into a usable factory plan. The Planner is the main workflow; Items, Buildings & Recipes, Corporations, and My Base support lookup and spatial planning.

## Operating Context

Players may plan alongside a game session or between sessions. Dense production information must remain scannable, and the planning canvas benefits from desktop space while existing compact layouts remain usable.

## Capabilities and Constraints

- Preserve calculations, interactions, navigation, persistence, and the protected game catalogs in `src/shared/data/`.
- Keep HeroUI as the component foundation, Tailwind CSS for local layout, and the installed Geist fonts.
- Maintain keyboard access, visible focus, readable data, and existing responsive behavior.
- Refine one page at a time, with user approval before moving to the next. This release is being prepared for near-term publication.

## Brand Commitments

The current dark identity and color palette are binding. The interface should remain minimal but have enough subtle depth to distinguish important surfaces. The goal is harmony within the existing design, not a new visual identity.

## Evidence on Hand

`README.md` describes the production workflow. `src/router/routes.ts` defines the five sections. `src/hero.ts`, `src/index.css`, and `src/shared/ui/` define the incumbent theme and shared presentation. `src/shared/data/README.md` defines the game-data boundary.
