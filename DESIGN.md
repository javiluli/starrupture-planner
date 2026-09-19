---
name: 'Starrupture Planner'
description: 'Current dark interface for planning StarRupture production.'
colors:
  primary: '#2563eb'
  secondary: '#7c3aed'
  background: '#05070c'
  surface: '#0b111b'
  surface-raised: '#101826'
  surface-deep: '#162236'
  foreground: '#e8eef5'
  divider: '#263852'
  success: '#16a34a'
  warning: '#f59e0b'
  danger: '#ef4444'
  item-raw: '#64748b'
  item-processed: '#a855f7'
  item-component: '#6366f1'
  item-material: '#22d3ee'
  item-ammo: '#ef4444'
  flow-export: '#00ff9f'
typography:
  display:
    fontFamily: 'Geist Sans, ui-sans-serif, system-ui, sans-serif'
    fontSize: '2.25rem'
    fontWeight: 600
  title:
    fontFamily: 'Geist Sans, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1.5rem'
    fontWeight: 600
  body:
    fontFamily: 'Geist Sans, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.95rem'
    fontWeight: 400
  label:
    fontFamily: 'Geist Sans, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.85rem'
    fontWeight: 500
spacing:
  xs: '0.25rem'
  sm: '0.5rem'
  md: '0.75rem'
  lg: '1rem'
  xl: '1.5rem'
components:
  panel-default:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.foreground}'
    rounded: '1rem'
    padding: '{spacing.lg}'
---

# Design System: Starrupture Planner

## Overview

The current interface is a dark, compact planning tool. Preserve its blue primary accent, supporting semantic colors, Geist typography, HeroUI components, and production data as the visual center. Minimalism should remain legible and gently layered rather than flat. Work on one page at a time and compare it with the same state before accepting a change.

## Colors

`src/hero.ts` is the authority for application colors; `src/index.css` defines the domain colors used by Items and the flow diagram. Use the primary accent for actions, focus, and selection, and keep domain category colors tied to their existing meanings. Text, dividers, and surfaces should distinguish levels without making every element compete.

## Typography

Geist Sans is the interface font; Geist Mono is reserved for code-like content. `src/shared/ui/typography.tsx` supplies the existing display, heading, body, small, and micro roles. Use those roles and HeroUI defaults before adding a local size.

## Layout

`PageContainer`, `PageHeader`, `PageContent`, and `Panel` compose the five pages. `Flex` and `Grid` expose gaps of 4, 8, 12, 16, and 24 px. Preserve the existing desktop-oriented Planner canvas and the compact navigation and layouts already supported by the application.

## Elevation & Depth

The base uses dark tonal surfaces and borders more than shadows. Add depth only where it clarifies a surface or interaction; any gradient, highlight, or shadow should be restrained and should reuse the current colors. Avoid repeated effects on the many nodes and edges in React Flow.

## Shapes

The shared `Panel` uses a rounded 1 rem surface and a one-pixel divider border. HeroUI controls retain their library shape unless a local mismatch is demonstrated. Keep borders and corner treatments consistent by role, rather than forcing one treatment onto every control.

## Components

HeroUI 2.8.10 provides the interactive primitives. The project wraps recurring layout and type in `src/shared/ui/`. A shared change requires checking all consumers; a page-specific issue should stay local.

## Do's and Don'ts

- **Do** preserve the existing palette, dark mode, information density, focus visibility, and domain color meanings.
- **Do** compare the same page state and viewport before and after visual changes.
- **Don't** apply glow, glass, large shadows, or decorative animation across the interface.
- **Don't** treat current inconsistencies as permanent rules: card density, local control heights, and surface levels still need page-by-page review.
