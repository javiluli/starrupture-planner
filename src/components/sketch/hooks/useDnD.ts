import { useCallback, useContext, useEffect } from 'react'
import { useReactFlow } from '@xyflow/react'
import DnDContext, { type OnDropAction } from '../context/DnDContext'

export const useDnD = () => {
  const context = useContext(DnDContext)
  const { screenToFlowPosition } = useReactFlow()

  if (!context) throw new Error('useDnD must be used within a DnDProvider')

  const { isDragging, setIsDragging, setDropAction, dropAction } = context

  const onDragStart = useCallback(
    (event: React.PointerEvent<HTMLDivElement>, onDrop: OnDropAction) => {
      event.preventDefault()
      ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
      setIsDragging(true)
      setDropAction(onDrop)
    },
    [setIsDragging, setDropAction],
  )

  const onDragEnd = useCallback(
    (event: PointerEvent) => {
      if (!isDragging) return

      const elementUnderPointer = document.elementFromPoint(event.clientX, event.clientY)
      const isDroppingOnFlow = elementUnderPointer?.closest('.react-flow')

      if (isDroppingOnFlow) {
        const flowPosition = screenToFlowPosition({ x: event.clientX, y: event.clientY })
        dropAction?.({ position: flowPosition })
      }

      setIsDragging(false)
    },
    [screenToFlowPosition, isDragging, dropAction, setIsDragging],
  )

  useEffect(() => {
    if (!isDragging) return
    document.addEventListener('pointerup', onDragEnd)
    return () => document.removeEventListener('pointerup', onDragEnd)
  }, [onDragEnd, isDragging])

  return { isDragging, onDragStart }
}
