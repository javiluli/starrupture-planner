import { useEffect, useRef, useState } from 'react'
import type { XYPosition } from '@xyflow/react'

interface PointerSnapshot {
  position: XYPosition
  isOverCanvas: boolean
}

/** Tracks the drag pointer once per animation frame and detects the editor canvas. */
export const usePointerPosition = (initialPosition: XYPosition) => {
  const [snapshot, setSnapshot] = useState<PointerSnapshot>({
    position: initialPosition,
    isOverCanvas: false,
  })
  const frameRef = useRef<number | undefined>(undefined)
  const pendingPositionRef = useRef(initialPosition)

  useEffect(() => {
    const updatePosition = (event: PointerEvent) => {
      pendingPositionRef.current = { x: event.clientX, y: event.clientY }
      if (frameRef.current !== undefined) return

      frameRef.current = requestAnimationFrame(() => {
        const position = pendingPositionRef.current
        const elementUnderPointer = document.elementFromPoint(position.x, position.y)

        setSnapshot({
          position,
          isOverCanvas: Boolean(elementUnderPointer?.closest('[data-base-designer-canvas]')),
        })
        frameRef.current = undefined
      })
    }

    document.addEventListener('pointermove', updatePosition)
    return () => {
      document.removeEventListener('pointermove', updatePosition)
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return snapshot
}
