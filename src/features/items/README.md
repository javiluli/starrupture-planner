# Items (Feature)

This feature contains the items list UI, filters, and related helpers.

## Structure

```
src/features/items
├─ hooks/               # Feature-level hooks (filters, etc.)
├─ lib/                 # Pure helpers for filtering/sorting
├─ ui/                  # UI components
│  ├─ filters/          # Search + selects
│  ├─ table/            # Table + cell renderers
│  └─ item-count.tsx    # Counter widget
├─ index.ts             # Feature exports
└─ README.md            # This file
```

## Notes

- Keep UI components focused on rendering.
- Move filtering logic into `lib/` and hooks into `hooks/`.
