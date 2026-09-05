# Game data boundary

The following files are external, versioned snapshots of the game's data:

- `buildings_and_recipes.json`
- `buildings_construction_area.json`
- `corporations_components.json`
- `items_catalog.json`

## Editing rule

Editors and AI agents must not change these four JSON files during feature work, refactors, tests, formatting, optimization, or bug fixes. In particular, do not add or alter IDs, recipes, items, fields, or values to make application code or a test pass.

Missing or inconsistent source data is a supported input condition. Handle it around the snapshots in parsers, indexes, selectors, calculation logic, UI fallbacks, and tests as appropriate. Do not fabricate catalog records as a workaround.

The files are not permanently immutable. They may be replaced when the game updates, but only as an explicit source-data update provided or approved by the user. Keep that replacement separate from unrelated code changes so the data diff can be reviewed on its own.

This restriction applies only to the four JSON snapshots. Supporting TypeScript modules, tests, and documentation in this directory may change normally.

## Runtime boundary

`index.ts` is the application-facing boundary for these snapshots. It performs the following work once, when the module is loaded:

- represents source omissions truthfully through `RawBuilding` and `RawItem`;
- normalizes missing building `recipes`, `power`, and `heat` fields to empty/zero values;
- enriches items with their corporation-level associations;
- exposes stable indexes by item ID, building ID, construction area, corporation ID, producer item, and item name;

Application code should consume these derived exports directly. Static catalogs do not belong in Zustand because they are not user-owned mutable state.

### Internal modules

- `index.ts`: public boundary; names and assembles every exported catalog and index.
- `catalog-normalization.ts`: converts raw JSON records into safe application models.
- `catalog-indexes.ts`: builds the reusable lookup maps.
- `building-production.ts`: owns the shared rule and index for item-producing buildings.
