import { Grid, Panel } from '@/shared/ui'
import { ReactFlowProvider } from '@xyflow/react'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { useBuildingDrag } from '../hooks/use-building-drag'
import { BaseDesignerCanvas } from './base-designer-canvas'
import { BuildingCatalog } from './catalog/building-catalog'
import { DragPreview } from './drag-preview'

const BaseDesignerWorkspaceContent = () => {
  const buildings = useDataStore(dataSelectors.buildings)
  const placeableBuildings = buildings.filter((building) => building.type !== 'core')
  const { activeDrag, startDragging, addBuildingWithKeyboard } = useBuildingDrag()
  const draggedBuilding = activeDrag ? buildings.find((building) => building.id === activeDrag.buildingId) : undefined

  return (
    <>
      <Grid
        gap="lg"
        className="
          min-h-224 min-w-0 grid-cols-1 grid-rows-[24rem_minmax(32rem,1fr)] items-stretch
          lg:h-full lg:min-h-0 lg:grid-cols-[22rem_minmax(0,1fr)] lg:grid-rows-1
        "
      >
        <Panel padding="none" variant="muted" className="min-h-0 min-w-0 overflow-hidden">
          <BuildingCatalog buildings={placeableBuildings} onStartDragging={startDragging} onAddWithKeyboard={addBuildingWithKeyboard} />
        </Panel>

        <Panel padding="none" variant="muted" className="min-h-0 min-w-0 overflow-hidden">
          <BaseDesignerCanvas />
        </Panel>
      </Grid>

      {activeDrag && draggedBuilding && (
        <DragPreview key={activeDrag.buildingId} building={draggedBuilding} initialPosition={activeDrag.initialPosition} />
      )}
    </>
  )
}

/** Complete controlled base editor workspace. */
export const BaseDesignerWorkspace = () => (
  <ReactFlowProvider>
    <BaseDesignerWorkspaceContent />
  </ReactFlowProvider>
)
