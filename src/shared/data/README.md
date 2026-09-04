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
