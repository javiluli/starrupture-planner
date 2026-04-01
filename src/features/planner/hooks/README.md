# Planner Hooks

Hooks propios de la feature para manejar estado y preparar el flow.

## Enlaces rapidos

- [Planner (overview)](../README.md)
- [Flow](../flow/README.md)
- [Lib](../lib/README.md)

## Indice de archivos

- `use-planner-target.ts`: lectura/escritura de targetId y targetIpm.
- `use-production-plan.ts`: construye el plan unico a partir del store.
- `use-flow-diagram.ts`: convierte el plan en nodes/edges/stats y gestiona fitView.
- `use-production.ts`: estado local de nodes/edges y handlers de React Flow.

## Recorrido rapido

1. `use-planner-target` actualiza target en el store.
2. `use-production-plan` lee target y supply del store y crea el `plan`.
3. `use-flow-diagram` recibe el `plan` y llama a `buildProductionFlowFromPlan`.
4. `use-production` mantiene nodes/edges y aplica cambios desde React Flow.
