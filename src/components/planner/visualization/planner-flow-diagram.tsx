import { useDataStore } from '@/store/data.store'
import { usePlannerStore } from '@/store/planner.store'
import { Background, BackgroundVariant, Controls, ReactFlow, ReactFlowProvider, useReactFlow } from '@xyflow/react'
import { useMemo, useRef } from 'react'
import { calculateProductionTotals } from '../core/calculateProductionTotals'
import { useProduction } from '../hooks/useProduction'
import { getLayoutedFlow } from '../utils'
import { OrbitalCargoLauncherNode, ProductionNode } from './reactflow-nodes'
import { SupplyNode } from './reactflow-nodes/SupplyNode'

const nodeTypes = { productionNode: ProductionNode, orbitalCargoLauncherNode: OrbitalCargoLauncherNode, supplyNode: SupplyNode }

function PlannerFlowDiagramInner() {
  const itemsStore = useDataStore((state) => state.items)
  const buildingsStore = useDataStore((state) => state.buildings)
  const targetId = usePlannerStore((state) => state.targetId)
  const targetIpm = usePlannerStore((state) => state.targetIpm)
  const setPlannerStats = usePlannerStore((state) => state.setPlannerStats)
  const supplies = usePlannerStore((state) => state.supplies)
  const updateSupply = usePlannerStore((state) => state.updateSupply)
  const isItemExportableToCorporation = usePlannerStore((state) => state.isItemExportableToCorporation)

  // Determina si el item Target debe ser exportado por "Corporation" o no
  const isExportable = isItemExportableToCorporation(targetId)

  const { nodes, setNodes, edges, setEdges, onNodesChange } = useProduction()
  const { fitView } = useReactFlow()

  // Guardamos el último targetId para saber cuándo ha cambiado realmente el producto
  const lastTargetIdRef = useRef(targetId)

  useMemo(() => {
    // Calculamos la logica de produccion
    const { totals, power, heat, buildings } = calculateProductionTotals(buildingsStore, targetId, targetIpm, supplies, isExportable)
    // Calculamos el Layout (Dagre)
    const { nodes: newNodes, edges: newEdges } = getLayoutedFlow(
      itemsStore,
      buildingsStore,
      targetId,
      targetIpm,
      totals,
      supplies,
      updateSupply,
      isExportable,
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
        fitView({ padding: 0.2, duration: 600 })
      }, 50)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsStore, buildingsStore, targetId, targetIpm, supplies, fitView, isExportable])

  return (
    <ReactFlow minZoom={0.1} nodes={nodes} edges={edges} onNodesChange={onNodesChange} nodeTypes={nodeTypes} colorMode="dark" fitView>
      <Background color="white" variant={BackgroundVariant.Dots} gap={30} />
      <Controls position="bottom-right" />
    </ReactFlow>
  )
}

export function PlannerFlowDiagram() {
  return (
    <ReactFlowProvider>
      <PlannerFlowDiagramInner />
    </ReactFlowProvider>
  )
}
