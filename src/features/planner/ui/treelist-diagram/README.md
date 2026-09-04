# Treelist Diagram

Esta carpeta contiene el adaptador del tree list para el planner.

## Flujo
1. `ProductionTreelistDiagram` obtiene `plan` desde `useProductionPlan`.
2. `useTreeData` transforma `plan.steps` en un arbol con `buildTree`.
3. `TreeList` desde `shared/ui/treelist` renderiza la estructura recursiva, las lineas y la expansion.
4. `PlannerTreeRow` define como se ve cada fila concreta del planner.

## Archivos clave
- `components/planner-tree-row.tsx`: UI especifica de cada fila del planner.
- `hooks/use-tree-data.ts`: arma el arbol a partir del plan.
- `lib/tree-build.ts`: logica de supply + generacion de hijos.
- `lib/tree-node-info.ts`: helper de labels/iconos del planner.
- `types.ts`: shape de nodo usado por este adaptador.

## Notas
- El supply se reparte por input y se descuenta del `supplyRemaining` para evitar duplicados.
- Si el supply cubre la demanda, no se genera rama de produccion para ese input.
- El componente reusable vive en `src/shared/ui/treelist` y no conoce nada de items, buildings ni recetas.
