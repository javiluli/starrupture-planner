import { usePlannerStore } from '@/store/planner.store'
import { Background, BackgroundVariant, Controls, ReactFlow, useReactFlow } from '@xyflow/react'
import { useMemo, useRef } from 'react'
import { calculateProductionTotals } from '../core/calculateProductionTotals'
import { useProduction } from '../hooks/useProduction'
import { PlannerSidebar } from '../ui'
import { getLayoutedFlow } from '../utils'
import { OrbitalExportSystemNode, ProductionNode } from './reactflow-nodes'
import { SupplyNode } from './reactflow-nodes/SupplyNode'

const nodeTypes = { productionNode: ProductionNode, orbitalExportSystemNode: OrbitalExportSystemNode, supplyNode: SupplyNode }

export interface PlannerFlowDiagramProps {
  addOrbitalExportSystem: boolean // agrega el edifio "Orbital Export System" al diagrama
}

export function PlannerFlowDiagram({ addOrbitalExportSystem }: PlannerFlowDiagramProps) {
  const targetId = usePlannerStore((state) => state.targetId)
  const targetIpm = usePlannerStore((state) => state.targetIpm)
  const setPlannerStats = usePlannerStore((state) => state.setPlannerStats)
  const supplies = usePlannerStore((state) => state.supplies)
  const updateSupply = usePlannerStore((state) => state.updateSupply)

  const { nodes, setNodes, edges, setEdges, onNodesChange } = useProduction()
  const { fitView } = useReactFlow()

  // Guardamos el último targetId para saber cuándo ha cambiado realmente el producto
  const lastTargetIdRef = useRef(targetId)

  useMemo(() => {
    // Calculamos la logica de produccion
    const { totals, power, heat, buildings } = calculateProductionTotals(targetId, targetIpm, supplies, addOrbitalExportSystem)
    // Calculamos el Layout (Dagre)
    const { nodes: newNodes, edges: newEdges } = getLayoutedFlow(
      targetId,
      targetIpm,
      totals,
      supplies,
      updateSupply,
      addOrbitalExportSystem, // agrega el edifio "Orbital Export System" al diagrama
    )

    setNodes(newNodes)
    setEdges(newEdges)
    setPlannerStats({ buildings, power, heat })

    // Si el targetId actual es distinto al que teníamos guardado...
    if (lastTargetIdRef.current !== targetId) {
      // Actualizamos la referencia al nuevo ID
      lastTargetIdRef.current = targetId

      // Ejecutamos el fitView con un pequeño delay para que React Flow
      // tenga tiempo de renderizar los nuevos nodos antes de calcular el zoom
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 800 })
      }, 50)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId, targetIpm, supplies, updateSupply, setNodes, setEdges, fitView, addOrbitalExportSystem])

  return (
    <div className="flex flex-1 w-full overflow-hidden">
      <PlannerSidebar />

      <div className="flex-1 relative overflow-hidden">
        <ReactFlow minZoom={0.1} nodes={nodes} edges={edges} onNodesChange={onNodesChange} nodeTypes={nodeTypes} colorMode="dark" fitView>
          <Background color="white" variant={BackgroundVariant.Dots} gap={30} />
          <Controls position="bottom-right" />
        </ReactFlow>
      </div>
    </div>
  )
}
