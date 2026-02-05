import { type Node } from '@xyflow/react'

interface Props {
  heat: number
  maxPower: number
  restPower: number
}

/**
 * Calcula los totales de calor y energía basados en el array de nodos actual.
 */
export const calculateStatsSketchTotals = (nodes: Node[]): Props => {
  return nodes.reduce(
    (acc, node) => {
      // Extraemos los valores de data, asegurando que sean números
      const heat = Number(node.data?.heat) || 0
      const power = Number(node.data?.power) || 0

      return {
        heat: acc.heat + heat,
        // Este valor indica cuanta energia hay disponible
        maxPower: acc.maxPower + (node.data.type === 'generator' ? power : 0),
        // Este valor indica cuanta energia se esta consumiendo
        restPower: acc.restPower + (node.data.type !== 'generator' ? power : 0),
      }
    },
    { heat: 0, maxPower: 0, restPower: 0 },
  )
}
