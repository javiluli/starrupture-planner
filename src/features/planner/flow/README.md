# Flow (Planner)

React Flow + helpers de layout y construccion de nodos/edges.

## Enlaces rapidos

- [Planner (overview)](../README.md)
- [Hooks](../hooks/README.md)

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

- `buildProductionFlowFromPlan` orquesta (plan -> flow).
- `planToFlow` transforma el plan en nodos y edges.
- `core/*` crea nodos/edges a partir del plan.
- El `plan` viene de `useProductionPlan`.

## Donde tocar segun necesidad

- Cambios de layout: `config/dagre-config.ts`.
- Cambios de nodos: `core/flow-nodes.ts`.
- Cambios de edges: `core/flow-edges.ts`.
- Ajustes de nombres/labels: `core/lookup.ts`.

## Tokens visuales

- `config/flow-theme.ts` adapta los tokens HSL de HeroUI a las propiedades JavaScript de React Flow.
- `src/index.css` contiene solo los colores de dominio: categorias de item y conexion de exportacion.
- Nodos, estados vacios y handles usan clases semanticas HeroUI (`content*`, `foreground`, `divider`, `primary`).
- No se deben introducir colores hexadecimales directamente en componentes o builders del Flow.
