import { useDnDPosition } from '../hooks/useDnDPosition'

interface Props {
  type: string | null
}

// The DragGhost component is used to display a ghost node when dragging a node into the flow.
export function DragGhost({ type }: Props) {
  const { position } = useDnDPosition()
  if (!position) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '80px',
        height: '80px',
        backgroundColor: 'rgba(52, 152, 219, 0.4)',
        border: '2px dashed #fff',
        borderRadius: '4px',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
      }}
    >
      <div style={{ fontSize: '8px', color: 'white', textAlign: 'center' }}>{type}</div>
    </div>
  )
}
