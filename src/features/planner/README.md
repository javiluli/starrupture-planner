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

## Notas

- UI debe enfocarse en render.
- La logica reusable vive en `lib/`.
- Lo especifico del flow vive en `flow/`.
- El store de planner vive en `state/`.

## Esquemas de flujo

### 1) Flujo vertical (top-down)

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
    Logic["planner-logic"]
    Recipes["recipes"]
    Corps["corporations"]
    SupplyLib["supply-count + supply-count-items"]
    Random["random-items"]
  end

  %% ===== Flow =====
  subgraph Flow["flow/"]
    Builder["builder/build-production-flow"]
    CoreEdges["core/flow-edges"]
    CoreNodes["core/flow-nodes"]
    CoreLookup["core/lookup"]
    CoreSupply["core/supply-count-inventory"]
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

  PlannerStore --> Logic
  PlannerStore --> Recipes
  PlannerStore --> Corps

  Builder --> Logic
  Builder --> CoreEdges
  Builder --> CoreNodes
  Builder --> Config

  CoreEdges --> CoreSupply
  CoreEdges --> CoreLookup
  CoreEdges --> Recipes

  CoreNodes --> CoreLookup
  CoreNodes --> Recipes

  UIControls --> SupplyLib
  UISidebar --> SupplyLib
  UIControls --> Random
```

### 2) Flujo intermedio (flowchart con llamadas)

```mermaid
flowchart LR
  UI["UI (controls/sidebar)"] --> Hook["use-flow-diagram"]
  Hook --> Store["planner.store"]
  Hook --> Builder["buildProductionFlow"]
  Hook --> Layout["flow-fit"]

  Store --> LibCorps["corporations"]
  Store --> LibRecipes["recipes"]
  Store --> LibLogic["planner-logic"]

  Builder --> LibLogic
  Builder --> FlowNodes["flow-nodes"]
  Builder --> FlowEdges["flow-edges"]
  Builder --> FlowConfig["flow/config"]

  FlowEdges --> LibRecipes
  FlowEdges --> FlowLookup["flow/lookup"]
  FlowNodes --> LibRecipes
  FlowNodes --> FlowLookup
```

### 3) Flujo intermedio (sequenceDiagram)

```mermaid
sequenceDiagram
  autonumber
  participant UI as UI (controls/sidebar)
  participant Hook as use-flow-diagram
  participant Store as planner.store
  participant Builder as buildProductionFlow
  participant CoreNodes as flow-nodes
  participant CoreEdges as flow-edges
  participant Logic as planner-logic
  participant Lib as lib helpers

  UI->>Hook: render + inputs
  Hook->>Store: read targetId/targetIpm/supplyCountByItem
  Hook->>Lib: isItemExportableToCorporation
  Hook->>Builder: buildProductionFlow(params)
  Builder->>Logic: calculateProductionTotals
  Builder->>CoreNodes: buildSupplyNodes/buildProductionNodes
  Builder->>CoreEdges: buildEdges
  CoreEdges->>Lib: findRecipeForItem
  CoreNodes->>Lib: findRecipeForItem
  Hook-->>UI: setNodes/setEdges/setStats
```

### 5) Flujo con colores por capa

```mermaid
flowchart LR
  classDef ui fill:#1f2937,stroke:#93c5fd,color:#e5e7eb
  classDef hooks fill:#0f172a,stroke:#38bdf8,color:#e5e7eb
  classDef state fill:#111827,stroke:#f59e0b,color:#fef3c7
  classDef lib fill:#0b1220,stroke:#34d399,color:#d1fae5
  classDef flow fill:#0b1220,stroke:#a78bfa,color:#ede9fe

  UI["ui/"]:::ui --> Hooks["hooks/"]:::hooks
  Hooks --> State["state/"]:::state
  Hooks --> Flow["flow/builder"]:::flow
  State --> Lib["lib/"]:::lib
  Flow --> FlowCore["flow/core"]:::flow
  FlowCore --> Config["flow/config"]:::flow
```

## Mapa de responsabilidad (store vs lib)

**Store (estado y reglas de negocio)**

- `setTargetId`, `setTargetIpm`, `setPlannerStats`
- `setSupplyCount`, `incrementSupplyCount`, `addSupplyItem`, `removeSupplyItem`

**Lib (funciones puras / helpers)**

- `calculateProductionTotals`, `clampTargetIpm`, `toFlowStats`
- `findRecipeForItem`
- `isItemExportableToCorporation`
- `filterItemsByQuery`, `groupItemsByType`, `getSupplyCountItemIds`
- `sortRequirementsByTime`, `pickRequirementByIndex`
- `getRandomItemIds`

**Flow (grafo y layout)**

- `buildProductionFlow` (builder principal)
- `buildEdges`, `connectSupplyAndProduction`
- `buildSupplyNodes`, `buildProductionNodes`, `buildLauncherNode`
- `buildSupplyCountInventory`
- `findItemById`, `getItemName`, `getItemType`, `getBuildingStats`
- `scheduleFlowFitView`, `shouldFitFlowView`
