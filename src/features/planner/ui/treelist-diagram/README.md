# Treelist Diagram

Esta carpeta contiene el diagrama tipo "tree list" para el planner.

## Flujo
1. `ProductionTreelistDiagram` obtiene `plan` desde `useProductionPlan`.
2. `useTreeData` transforma `plan.steps` en un arbol con `buildTree`.
3. `TreeNode` renderiza el arbol usando `TreeLines` para las lineas.

## Archivos clave
- `components/tree-node.tsx`: nodo principal (render recursivo).
- `components/tree-lines.tsx`: lineas del arbol.
- `hooks/use-tree-data.ts`: arma el arbol a partir del plan.
- `lib/tree-build.ts`: logica de supply + generacion de hijos.
- `lib/tree-node-info.ts`: helper de labels/iconos.

## Notas
- El supply se reparte por input y se descuenta del `supplyRemaining` para evitar duplicados.
- Si el supply cubre la demanda, no se genera rama de produccion para ese input.
