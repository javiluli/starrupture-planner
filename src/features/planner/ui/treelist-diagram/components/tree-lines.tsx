import { memo } from 'react'
import { TREE_LINE_CLASSES } from '../lib/tree-config'

interface TreeLinesProps {
  depth: number
  isLast: boolean
  ancestorLineFlags: boolean[]
}

const LINE_VERTICAL = `absolute ${TREE_LINE_CLASSES.LINE_X} w-0.5 bg-content4`
const LINE_HORIZONTAL = `absolute ${TREE_LINE_CLASSES.LINE_X} ${TREE_LINE_CLASSES.LINE_Y} h-0.5 bg-content4 ${TREE_LINE_CLASSES.LINE_GAP}`

const AncestorLine = ({ show }: { show: boolean }) => (
  <div className={`${TREE_LINE_CLASSES.INDENT_W} relative ${show ? TREE_LINE_CLASSES.LINE_CAP : ''}`}>
    {show && <div className={`${LINE_VERTICAL} top-0 bottom-0`} />}
  </div>
)

const CurrentLine = ({ isLast }: { isLast: boolean }) => (
  <div className={`${TREE_LINE_CLASSES.INDENT_W} relative ${TREE_LINE_CLASSES.LINE_CAP}`}>
    <div className={`${LINE_VERTICAL} ${isLast ? 'h-1/2 top-0' : 'h-full top-0'}`} />
    <div className={LINE_HORIZONTAL} />
  </div>
)

export const TreeLines = memo(({ depth, isLast, ancestorLineFlags }: TreeLinesProps) => {
  if (depth === 0) return null

  return (
    <div className="flex shrink-0">
      {ancestorLineFlags.map((hasLine, i) => (
        <AncestorLine key={i} show={hasLine} />
      ))}
      <CurrentLine isLast={isLast} />
    </div>
  )
})
