import { useState, useEffect, useCallback } from 'react'
import { type XYPosition } from '@xyflow/react'

export const useDnDPosition = () => {
  const [position, setPosition] = useState<XYPosition | undefined>(undefined)

  const onDrag = useCallback((event: PointerEvent) => {
    setPosition({ x: event.clientX, y: event.clientY })
  }, [])

  useEffect(() => {
    document.addEventListener('pointermove', onDrag)
    return () => document.removeEventListener('pointermove', onDrag)
  }, [onDrag])

  return { position }
}
