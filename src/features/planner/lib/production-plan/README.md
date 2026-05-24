# Production Plan (Planner)

Esta carpeta concentra toda la logica de calculo del plan.

## Enlaces rapidos

- [Planner (overview)](../../README.md)
- [Lib](../README.md)
- [Flow](../../flow/README.md)

## Archivos

- `plan-resolver.ts`: resuelve building y receta efectiva por item (variantes).
- `build-production-plan.ts`: orquestacion principal.
- `calculate-totals.ts`: recursion para demanda neta + supply inventory.
- `build-steps.ts`: transforma totals en pasos.
- `types.ts`: tipos del plan.

## Flujo interno

1. `plan-resolver` resuelve building/receta efectiva por item.
2. `calculate-totals` genera demanda neta.
3. `build-steps` genera steps con recetas.
4. `build-production-plan` calcula stats y ensambla el plan.
