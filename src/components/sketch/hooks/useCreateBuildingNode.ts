import { useCallback } from 'react'
import { useNodes, useReactFlow, type XYPosition } from '@xyflow/react'
import type { OnDropAction } from '../context/DnDContext'

export const useCreateBuildingNode = () => {
  const nodes = useNodes()
  const { setNodes } = useReactFlow()

  const createBuildingNode = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (building: any): OnDropAction => {
      return ({ position }: { position: XYPosition }) => {
        // 1. Obtener referencia del padre
        const parentNode = nodes.find((n) => n.id === 'campo-1')
        const pX = parentNode?.position.x ?? 10
        const pY = parentNode?.position.y ?? 10

        // 2. Dimensiones (puedes ajustarlas según el objeto building)
        const w = (building.width || 4) * 10
        const h = (building.height || 4) * 10

        // 3. Cálculo de posición relativa (Resta maestra)
        let xRelativa = position.x - pX - w / 2
        let yRelativa = position.y - pY - h / 2

        // 4. Snap y Seguridad
        xRelativa = Math.round(xRelativa / 10) * 10
        yRelativa = Math.round(yRelativa / 10) * 10

        if (xRelativa < 0) xRelativa = 0
        if (yRelativa < 0) yRelativa = 0

        const newNode = {
          id: `building-${Date.now()}`,
          type: 'buildingNode',
          position: { x: xRelativa, y: yRelativa },
          parentId: 'campo-1',
          extent: 'parent' as const,
          draggable: true,
          selectable: true,
          data: {
            id: building.id,
            heat: building.heat,
            power: building.power,
            type: building.type,
            label: building.name, // Útil para mostrar nombres
          },
          style: { width: 40, height: 40 },
        }

        setNodes((nds) => nds.concat(newNode))
      }
    },
    [setNodes, nodes],
  )

  return { createBuildingNode }
}
