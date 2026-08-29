import { memo, useMemo, type ReactNode } from 'react'
import { TreeListLines } from './tree-lines'
import { useTreeExpansion } from './use-tree-expansion'
import type { TreeListLineConfig, TreeListNodeRenderProps, TreeListProps } from './types'

const DEFAULT_LINE_CONFIG: TreeListLineConfig = {
  indentWidthClass: 'w-14',
  lineXClass: 'left-[28px]',
  lineYClass: 'top-1/2 -translate-y-1/2',
  lineGapClass: 'right-[-2px]',
  lineColorClass: 'bg-content4',
  capExtensionPx: 16,
}

const getDefaultNodeId = <TNode,>(node: TNode, path: string) => {
  const nodeId = (node as { id?: string }).id
  return nodeId ? `${path}::${nodeId}` : path
}

const getDefaultChildren = <TNode,>(node: TNode) => (node as { children?: TNode[] }).children

interface TreeListNodeViewProps<TNode> {
  node: TNode
  path: string
  depth: number
  isLast: boolean
  ancestorLineFlags: boolean[]
  getChildren: (node: TNode) => TNode[] | undefined
  getNodeId: (node: TNode, path: string) => string
  renderNode: (props: TreeListNodeRenderProps<TNode>) => ReactNode
  expandedMap: Map<string, boolean>
  onToggle: (nodeId: string) => void
  lineConfig: TreeListLineConfig
}

const TreeListNodeView = <TNode,>({
  node,
  path,
  depth,
  isLast,
  ancestorLineFlags,
  getChildren,
  getNodeId,
  renderNode,
  expandedMap,
  onToggle,
  lineConfig,
}: TreeListNodeViewProps<TNode>) => {
  const children = getChildren(node) ?? []
  const hasChildren = children.length > 0
  const nodeId = getNodeId(node, path)
  const isExpanded = expandedMap.get(nodeId) ?? true

  const nextAncestorFlags = useMemo(() => {
    if (!hasChildren) return ancestorLineFlags
    return [...ancestorLineFlags, depth > 0 ? !isLast : false]
  }, [ancestorLineFlags, depth, isLast, hasChildren])

  const toggle = () => {
    if (hasChildren) onToggle(nodeId)
  }

  return (
    <div className="flex flex-col group/treelist-node">
      <div className="flex items-stretch group/treelist-row">
        <TreeListLines depth={depth} isLast={isLast} ancestorLineFlags={ancestorLineFlags} lineConfig={lineConfig} />

        <div className={`flex items-center flex-1 py-2 relative ${lineConfig.indentWidthClass}`}>
          {depth === 0 ? <div className={`${lineConfig.indentWidthClass} shrink-0`} /> : null}
          {renderNode({ node, path, depth, isLast, hasChildren, isExpanded, toggle })}
        </div>
      </div>

      {hasChildren ? (
        <div className={`transition-all duration-300 ease-out ${isExpanded ? 'opacity-100 translate-y-0 h-auto visible' : 'opacity-0 -translate-y-3 h-0 overflow-hidden invisible'}`}>
          {isExpanded
            ? children.map((child, index) => (
                <TreeListNodeView
                  key={getNodeId(child, `${path}.${index}`)}
                  node={child}
                  path={`${path}.${index}`}
                  depth={depth + 1}
                  isLast={index === children.length - 1}
                  ancestorLineFlags={nextAncestorFlags}
                  getChildren={getChildren}
                  getNodeId={getNodeId}
                  renderNode={renderNode}
                  expandedMap={expandedMap}
                  onToggle={onToggle}
                  lineConfig={lineConfig}
                />
              ))
            : null}
        </div>
      ) : null}
    </div>
  )
}

const TreeListRaw = <TNode,>({
  data,
  getNodeId,
  getChildren,
  defaultExpanded = true,
  className,
  lineConfig,
  children,
}: TreeListProps<TNode>) => {
  const resolvedGetNodeId = useMemo(() => getNodeId ?? getDefaultNodeId<TNode>, [getNodeId])
  const resolvedGetChildren = useMemo(() => getChildren ?? getDefaultChildren<TNode>, [getChildren])
  const resolvedLineConfig = useMemo(() => ({ ...DEFAULT_LINE_CONFIG, ...lineConfig }), [lineConfig])
  const { expandedMap, toggle } = useTreeExpansion(data, resolvedGetChildren, resolvedGetNodeId, defaultExpanded)

  if (!data.length) return null

  return (
    <div className={className}>
      {data.map((node, index) => (
        <TreeListNodeView
          key={resolvedGetNodeId(node, `${index}`)}
          node={node}
          path={`${index}`}
          depth={0}
          isLast={index === data.length - 1}
          ancestorLineFlags={[]}
          getChildren={resolvedGetChildren}
          getNodeId={resolvedGetNodeId}
          renderNode={children}
          expandedMap={expandedMap}
          onToggle={toggle}
          lineConfig={resolvedLineConfig}
        />
      ))}
    </div>
  )
}

export const TreeList = memo(TreeListRaw) as typeof TreeListRaw
