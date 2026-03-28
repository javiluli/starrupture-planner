# Flow (Planner)

React Flow + helpers de layout y construccion de nodos/edges.

## Estructura

```
flow/
+- builder/
|  +- build-production-flow.ts
+- core/
|  +- connect-edges.ts
|  +- flow-edges.ts
|  +- flow-nodes.ts
|  +- lookup.ts
+- config/
+- diagram/
+- layout/
+- plan-to-flow.ts
```

## Rol en el sistema

- `buildProductionFlow` solo orquesta (plan -> flow).
- `planToFlow` transforma el plan en nodos y edges.
- `core/*` genera nodos y edges con layout estable.

## Donde tocar segun necesidad

- Cambios de layout: `config/dagre-config.ts`.
- Cambios de nodos: `core/flow-nodes.ts`.
- Cambios de edges: `core/flow-edges.ts`.
