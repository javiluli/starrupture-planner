import { useEffect } from 'react'
import type { ReactFlowInstance } from '@xyflow/react'

/**
 * Ejecuta fitView en el siguiente frame para evitar jank.
 *
 * @param fitView Callback de React Flow para ajustar el viewport.
 */
export const scheduleFlowFitView = (fitView: ReactFlowInstance['fitView']) => {
  setTimeout(() => {
    fitView({ padding: 0.1, duration: 600 })
  }, 100)
}

/**
 * Indica si debemos re-centrar el flow por cambio de target.
 *
 * @param prevTargetId Id anterior.
 * @param nextTargetId Id actual.
 * @returns True si el target cambio.
 */
export const shouldFitFlowView = (prevTargetId: string, nextTargetId: string) => prevTargetId !== nextTargetId

/**
 * Hook auxiliar para disparar fitView cuando cambia el target.
 *
 * @param prevTargetId Id anterior.
 * @param nextTargetId Id actual.
 * @param fitView Callback de React Flow para ajustar el viewport.
 * @param onFit Callback local para sincronizar refs.
 */
export const useFlowFitEffect = (prevTargetId: string, nextTargetId: string, fitView: ReactFlowInstance['fitView'], onFit: () => void) => {
  useEffect(() => {
    if (!shouldFitFlowView(prevTargetId, nextTargetId)) return
    onFit()
    scheduleFlowFitView(fitView)
  }, [prevTargetId, nextTargetId, fitView, onFit])
}
