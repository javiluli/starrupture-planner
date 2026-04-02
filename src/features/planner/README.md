# Planner (Feature)

Esta feature contiene el planner de produccion: UI, flow y logica de soporte.

## Enlaces rapidos

- [Flow (React Flow)](./flow/README.md)
- [Hooks](./hooks/README.md)
- [Lib](./lib/README.md)
- [Production plan](./lib/production-plan/README.md)

## Estructura

```
src/features/planner
+- flow/            # React Flow, layout y helpers del grafo
+- hooks/           # Hooks propios de la feature
+- lib/             # Helpers puros (calculos, filtros, lookups)
+- state/           # (obsoleto) el store real vive en src/store/planner.store.ts
+- ui/              # UI agrupada por dominio
+- constants.ts     # Constantes de la feature
+- index.ts         # Exports publicos
```

## Principios

- UI solo renderiza y despacha acciones.
- La logica del plan vive en `lib/production-plan/`.
- El flow solo convierte un plan a nodos/edges.
- El store mantiene estado y no calcula el plan.

## Guia rapida del flujo

1. `TargetItemSelect` / `TargetRateInput` actualizan el store via `usePlannerTarget`.
2. `useProductionPlan` lee `targetId`, `targetIpm` y `supplyCountByItem` del store.
3. `useProductionPlan` llama a `buildProductionPlan` y devuelve un `plan` unico.
4. Cada diagrama consume el `plan`:
   - `ProductionFlowDiagram` -> `useFlowDiagram` -> `buildProductionFlowFromPlan` -> `planToFlow` -> React Flow.
   - `ProductionTreelistDiagram` -> `buildTree(plan.steps)`.
   - `ProductionItemsDiagram` -> lista `plan.steps`.

## Mini-diagrama (proposito por paso)

```
ProductionFlowDiagram
  -> useFlowDiagram
     (orquesta el render del flow: prepara nodes/edges/stats)
  -> buildProductionFlowFromPlan
     (convierte el plan en datos de flow)
  -> planToFlow
     (transforma pasos en nodos/edges)
  -> React Flow
     (renderiza el grafo y la interaccion)
```

**Resumen rapido**
- `ProductionFlowDiagram`: UI, solo renderiza.
- `useFlowDiagram`: prepara datos visuales a partir del plan.
- `buildProductionFlowFromPlan`: plan -> flow (sin recalcular plan).
- `planToFlow`: crea nodos/edges con la info del plan.
- React Flow: dibuja el grafo.

## Flujo principal (resumen)

```
UI -> useProductionPlan -> buildProductionPlan -> buildProductionFlowFromPlan -> planToFlow -> React Flow
```

## Flujo detallado (top-down)

```mermaid
flowchart TD
  %% ===== UI =====
  subgraph UI["ui/ (React components)"]
    UIControls["controls/*"]
    UISidebar["sidebar/*"]
    UIStats["stats-bar.tsx"]
  end

  %% ===== Hooks =====
  subgraph Hooks["hooks/"]
    UseFlow["use-flow-diagram"]
    UsePlan["use-production-plan"]
    UseProd["use-production"]
  end

  %% ===== State =====
  subgraph State["state/"]
    PlannerStore["planner.store (zustand)"]
  end

  %% ===== Lib =====
  subgraph Lib["lib/ (helpers)"]
    Plan["production-plan/"]
    Recipes["recipes"]
    Corps["corporations"]
    SupplyLib["supply-count + supply-count-items"]
    Random["random-items"]
    Logic["planner-logic (clamp)"]
  end

  %% ===== Flow =====
  subgraph Flow["flow/"]
    Builder["builder/build-production-flow"]
    PlanToFlow["plan-to-flow"]
    CoreEdges["core/flow-edges"]
    CoreNodes["core/flow-nodes"]
    CoreLookup["core/lookup"]
    Layout["layout/flow-fit"]
    Diagram["diagram/production-flow-diagram"]
    Config["config/*"]
  end

  UIControls --> UsePlan
  UISidebar --> UsePlan
  UIStats --> PlannerStore
  Diagram --> UsePlan
  UsePlan --> UseFlow
  UseFlow --> UseProd
  UseFlow --> PlannerStore
  UseFlow --> Builder
  UseFlow --> Layout

  PlannerStore --> Plan
  PlannerStore --> Recipes
  PlannerStore --> Corps

  Builder --> PlanToFlow
  Builder --> CoreEdges
  Builder --> CoreNodes
  Builder --> Config

  CoreEdges --> CoreLookup
  CoreNodes --> CoreLookup

  UIControls --> SupplyLib
  UISidebar --> SupplyLib
  UIControls --> Random
```

## Secuencia (alto nivel)

```mermaid
sequenceDiagram
  autonumber
  participant UI as UI (controls/sidebar)
  participant PlanHook as use-production-plan
  participant Hook as use-flow-diagram
  participant Store as planner.store
  participant Builder as buildProductionFlowFromPlan
  participant Plan as production-plan
  participant PlanToFlow as plan-to-flow
  participant CoreNodes as flow-nodes
  participant CoreEdges as flow-edges

  UI->>PlanHook: read targetId/targetIpm/supplyCountByItem
  PlanHook->>Plan: buildProductionPlan
  UI->>Hook: render + inputs
  Hook->>Store: read targetId
  Hook->>Builder: buildProductionFlowFromPlan(plan)
  Builder->>PlanToFlow: planToFlow
  PlanToFlow->>CoreNodes: buildSupplyNodes/buildProductionNodes
  PlanToFlow->>CoreEdges: buildEdges
  Hook-->>UI: setNodes/setEdges/setStats
```

## Mapa de responsabilidad (store vs lib vs flow)

**Store (estado y acciones)**

- `setTargetId`, `setTargetIpm`, `setPlannerStats`
- `setSupplyCount`, `incrementSupplyCount`, `addSupplyItem`, `removeSupplyItem`

**Lib (funciones puras / helpers)**

- `buildProductionPlan`, `clampTargetIpm`
- `findRecipeForItem`
- `isItemExportableToCorporation`
- `getSupplyCountItemIds`, `filterItemsByQuery`, `groupItemsByType`
- `sortRequirementsByTime`, `pickRequirementByIndex`
- `getRandomItemIds`

**Flow (grafo y layout)**

- `buildProductionFlowFromPlan` (plan -> flow)
- `planToFlow`
- `buildEdges`, `connectSupplyAndProduction`
- `buildSupplyNodes`, `buildProductionNodes`, `buildLauncherNode`
- `findItemById`, `getItemName`, `getItemType`, `getBuildingStats`
- `scheduleFlowFitView`, `shouldFitFlowView`

## Notas para devs

- Si necesitas cambiar reglas de calculo, edita `lib/production-plan/`.
- Si el layout se ve raro, revisa `flow/config/dagre-config.ts`.
- Si cambias el nombre de un tipo o campo, ajusta `ProductionStep` y `planToFlow`.



