# Planner Flow Structure

Current layout:

```
flow/
+- builder/
|  +- build-production-flow.ts
+- core/
|  +- connect-edges.ts
|  +- flow-edges.ts
|  +- flow-nodes.ts
|  +- lookup.ts
|  +- supply-inventory.ts
+- config/
+- diagram/
|  +- production-flow-diagram.tsx
+- layout/
|  +- flow-fit.ts
+- nodes/
+- index.ts
```

Notes:

- `builder/` contiene el builder del grafo (layout Dagre + orquestacion).
- `core/` contiene helpers puros del flow (edges, nodes, lookup, inventory).
- `diagram/` contiene el ReactFlow wrapper.
- `layout/` contiene el fitView y helpers de layout.
- `index.ts` expone la API publica del flow.
