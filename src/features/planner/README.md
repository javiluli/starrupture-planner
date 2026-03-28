# Planner (Feature)

Esta feature contiene el planner de produccion: UI, flow y logica de soporte.

## Estructura

```
src/features/planner
+- flow/            # React Flow, layout y helpers del grafo
+- hooks/           # Hooks propios de la feature
+- lib/             # Helpers puros (calculos, filtros, lookups)
+- state/           # Zustand store de la feature
+- ui/              # UI agrupada por dominio
+- constants.ts     # Constantes de la feature
+- index.ts         # Exports publicos
```

## Principios

- UI solo renderiza y despacha acciones.
- La logica del plan vive en `lib/production-plan/`.
- El flow solo convierte un plan a nodos/edges.
- El store mantiene estado y no calcula el plan.

## Flujo principal (resumen)

```
UI -> hook -> buildProductionFlow -> buildProductionPlan -> planToFlow -> React Flow
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

  UIControls --> UseFlow
  UISidebar --> UseFlow
  UIStats --> PlannerStore
  Diagram --> UseFlow
  UseFlow --> UseProd
  UseFlow --> PlannerStore
  UseFlow --> Builder
  UseFlow --> Layout

  PlannerStore --> Plan
  PlannerStore --> Recipes
  PlannerStore --> Corps

  Builder --> Plan
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
  participant Hook as use-flow-diagram
  participant Store as planner.store
  participant Builder as buildProductionFlow
  participant Plan as production-plan
  participant PlanToFlow as plan-to-flow
  participant CoreNodes as flow-nodes
  participant CoreEdges as flow-edges

  UI->>Hook: render + inputs
  Hook->>Store: read targetId/targetIpm/supplyCountByItem
  Hook->>Builder: buildProductionFlow(params)
  Builder->>Plan: buildProductionPlan
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

- `buildProductionFlow` (wrapper plan -> flow)
- `planToFlow`
- `buildEdges`, `connectSupplyAndProduction`
- `buildSupplyNodes`, `buildProductionNodes`, `buildLauncherNode`
- `findItemById`, `getItemName`, `getItemType`, `getBuildingStats`
- `scheduleFlowFitView`, `shouldFitFlowView`

## Notas para devs

- Si necesitas cambiar reglas de calculo, edita `lib/production-plan/`.
- Si el layout se ve raro, revisa `flow/config/dagre-config.ts`.
- Si cambias el nombre de un tipo o campo, ajusta `ProductionStep` y `planToFlow`.
