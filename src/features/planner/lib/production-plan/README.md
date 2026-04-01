# Production Plan (Planner)

Esta carpeta concentra toda la logica de calculo del plan.

## Enlaces rapidos

- [Planner (overview)](../../README.md)
- [Lib](../README.md)
- [Flow](../../flow/README.md)

## Archivos

- `build-production-plan.ts`: orquestacion principal.
- `calculate-totals.ts`: recursion para demanda neta + supply inventory.
- `build-steps.ts`: transforma totals en pasos.
- `types.ts`: tipos del plan.

## Flujo interno

1. `calculate-totals` genera demanda neta.
2. `build-steps` genera steps con recetas.
3. `build-production-plan` calcula stats y ensambla el plan.
