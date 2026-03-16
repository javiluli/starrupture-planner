# i18n Structure

This folder groups all localization-related resources.

## UI Text Translations
- `ui/en/` and `ui/es/` contain UI copy (strings used directly by the app UI).
- Managed by `i18n.ts` (i18next initialization).

## Game Data (Localized)
- `game-data/` contains localized game data (items, buildings, corporations) per language.
- `game-data.ts` wires the localized data into a single `translations` object for the data store.

## Files
- `i18n.ts`: i18next setup for UI text.
- `game-data.ts`: localized game data registry used by the data store.
