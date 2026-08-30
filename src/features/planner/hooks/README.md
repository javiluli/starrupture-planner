# Planner Hooks

Hooks que conectan la UI con las entradas del store y el plan compartido.

## Enlaces

- [Planner](../README.md)
- [Flow](../flow/README.md)
- [Lib](../lib/README.md)

## Indice

- `use-planner-target.ts`: acciones de target e IPM.
- `use-open-planner.ts`: selecciona un item y navega al Planner.
- `use-production-plan.ts`: consume el plan creado por `ProductionPlanProvider`.
- `use-flow-diagram.ts`: adapta el plan a nodes/edges y gestiona `fitView`.
- `use-production.ts`: estado e interacciones locales de React Flow.

`use-production-plan.ts` no calcula ni copia stats al store. Todos sus consumidores reciben la misma instancia derivada por el provider de la pagina.
