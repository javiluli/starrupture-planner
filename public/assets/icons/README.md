# Icon policy

- Store catalog icons as `public/assets/icons/<kind>/<catalog-id>.webp` without changing JSON IDs to fit filenames.
- Keep asset updates separate from source-data updates and do not delete unmatched files automatically.
- The 26 item icons not referenced by the current catalog are retained intentionally for future game data.
- `AssetImage` shows a neutral fallback when a resource cannot load.
- Base Designer intentionally represents `zipline` with the Lucide `Cable` icon until an approved game asset exists.
