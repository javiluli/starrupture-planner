import { memo, type KeyboardEvent } from 'react'
import type { TreeListNodeProps } from './types'

const ROW_BASE = 'flex items-center flex-1 text-left rounded-lg transition-colors'

const handleKeyDown = (event: KeyboardEvent<HTMLElement>, canToggle: boolean, toggle: () => void) => {
  if (!canToggle) return

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggle()
  }
}

const TreeListNodeRaw = <TNode,>({
  hasChildren,
  isExpanded,
  toggle,
  className,
  interactiveClassName = 'cursor-pointer',
  disabledClassName = 'cursor-default',
  children,
}: TreeListNodeProps<TNode>) => {
  return (
    <div
      role={hasChildren ? 'button' : undefined}
      tabIndex={hasChildren ? 0 : -1}
      aria-expanded={hasChildren ? isExpanded : undefined}
      onClick={hasChildren ? toggle : undefined}
      onKeyDown={(event) => handleKeyDown(event, hasChildren, toggle)}
      className={`${ROW_BASE} ${hasChildren ? interactiveClassName : disabledClassName} ${className ?? ''}`}
    >
      {children}
    </div>
  )
}

export const TreeListNode = memo(TreeListNodeRaw) as typeof TreeListNodeRaw
