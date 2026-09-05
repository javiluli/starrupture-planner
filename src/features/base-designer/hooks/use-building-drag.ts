import type { PointerEvent as ReactPointerEvent } from 'react'
import { useEffect, useState } from 'react'
import { useReactFlow, type XYPosition } from '@xyflow/react'
import { BASE_FIELD_NODE_ID } from '../base-designer.config'
import { createBuildingNode, findAvailableBuildingPosition } from '../lib/create-building-node'
import { buildingById } from '@/shared/data'
import { baseDesignerSelectors, useBaseDesignerStore } from '@/store/base-designer.store'

interface ActiveBuildingDrag {
  buildingId: string
  initialPosition: XYPosition
}

const createInstanceId = () => crypto.randomUUID()

/** Coordinates pointer and keyboard placement while React Flow remains store-controlled. */
export const useBuildingDrag = () => {
  const addBuildingNode = useBaseDesignerStore(baseDesignerSelectors.addBuildingNode)
  const { screenToFlowPosition } = useReactFlow()
  const [activeDrag, setActiveDrag] = useState<ActiveBuildingDrag>()

  const startDragging = (event: ReactPointerEvent<HTMLElement>, buildingId: string) => {
    if (event.button !== 0) return
    if (event.pointerType === 'mouse') event.preventDefault()

    event.currentTarget.setPointerCapture(event.pointerId)
    setActiveDrag({
      buildingId,
      initialPosition: { x: event.clientX, y: event.clientY },
    })
  }

  const addBuildingWithKeyboard = (buildingId: string) => {
    const building = buildingById.get(buildingId)
    if (!building) return

    const state = useBaseDesignerStore.getState()
    const position = findAvailableBuildingPosition(state.nodes, buildingId)
    if (!position) return

    addBuildingNode(createBuildingNode({ building, absolutePosition: position, instanceId: createInstanceId() }))
  }

  useEffect(() => {
    if (!activeDrag) return

    const cancelDragging = () => setActiveDrag(undefined)
    const finishDragging = (event: PointerEvent) => {
      const dropTarget = document.elementFromPoint(event.clientX, event.clientY)
      const isInsideCanvas = Boolean(dropTarget?.closest('[data-base-designer-canvas]'))
      const building = buildingById.get(activeDrag.buildingId)

      if (isInsideCanvas && building) {
        const parentPosition = useBaseDesignerStore.getState().nodes.find((node) => node.id === BASE_FIELD_NODE_ID)?.position
        const absolutePosition = screenToFlowPosition({ x: event.clientX, y: event.clientY })
        addBuildingNode(
          createBuildingNode({
            building,
            absolutePosition,
            instanceId: createInstanceId(),
            parentPosition,
          }),
        )
      }

      setActiveDrag(undefined)
    }
    const cancelWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') cancelDragging()
    }

    document.addEventListener('pointerup', finishDragging)
    document.addEventListener('pointercancel', cancelDragging)
    document.addEventListener('keydown', cancelWithEscape)
    window.addEventListener('blur', cancelDragging)

    return () => {
      document.removeEventListener('pointerup', finishDragging)
      document.removeEventListener('pointercancel', cancelDragging)
      document.removeEventListener('keydown', cancelWithEscape)
      window.removeEventListener('blur', cancelDragging)
    }
  }, [activeDrag, addBuildingNode, screenToFlowPosition])

  return {
    activeDrag,
    startDragging,
    addBuildingWithKeyboard,
  }
}
