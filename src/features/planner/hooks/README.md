# Planner Hooks

Hooks propios de la feature para manejar estado y flow.

## Indice de archivos

- `use-flow-diagram.ts`: orquesta el build del flow y sincroniza fitView.
- `use-production.ts`: estado local de nodos/edges y handler de cambios.

## Recorrido rapido

1. `use-flow-diagram` obtiene datos del store y llama al builder del flow.
2. `use-production` mantiene nodes/edges y aplica cambios desde React Flow.
