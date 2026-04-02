import { AssetImage, Flex, Typography } from '@/shared/ui'
import { memo, useCallback, useMemo } from 'react'
import type { ProductionStep } from '../../../lib'
import { TREE_LINE_CLASSES } from '../lib/tree-config'
import { getTreeNodeInfo } from '../lib/tree-node-info'
import { getTreeNodeKey } from '../lib/tree-keys'
import { TreeLines } from './tree-lines'

export interface TreeNodeData extends Partial<ProductionStep> {
  itemId: string
  isRawMaterial?: boolean
  isFinalProduct?: boolean
  isSupply?: boolean
  children?: TreeNodeData[]
}

interface TreeNodeProps {
  node: TreeNodeData
  nodePath: string
  itemNameMap: Map<string, string>
  depth: number
  isLast: boolean
  ancestorLineFlags: boolean[]
  isExpandedById: Map<string, boolean>
  onToggle: (nodeId: string) => void
}

const ROW_BUTTON_BASE = 'flex items-center gap-3 flex-1 text-left rounded-lg pl-0 pr-2 py-2 transition-colors'
const ROW_BUTTON_INTERACTIVE = 'cursor-pointer hover:bg-content1/30'

const ICON_BASE = 'relative shrink-0 rounded-xl border-2 p-1 bg-content1 transition-transform duration-200'
const ICON_FINAL = 'border-primary'
const ICON_DEFAULT = 'border-content4'
const ICON_DIM = 'opacity-70'

const TreeNodeContent = memo(
  ({
    node,
    itemNameMap,
    isOpen,
    hasChildren,
    onToggle,
  }: {
    node: TreeNodeData
    itemNameMap: Map<string, string>
    isOpen: boolean
    hasChildren: boolean
    onToggle: () => void
  }) => {
    const { isSupply, label, itemLabel, iconKind, iconId, showBuildingCount, supplyCount } = getTreeNodeInfo(node, itemNameMap)

    const buttonClasses = `${ROW_BUTTON_BASE} ${hasChildren ? ROW_BUTTON_INTERACTIVE : 'cursor-default'}`
    const iconBorder = node.isFinalProduct ? ICON_FINAL : ICON_DEFAULT
    const iconDim = hasChildren ? '' : ` ${ICON_DIM}`

    return (
      <button
        type="button"
        onClick={onToggle}
        disabled={!hasChildren}
        className={buttonClasses}
        aria-expanded={hasChildren ? isOpen : undefined}
      >
        <div className={`${ICON_BASE} ${iconBorder}${iconDim}`}>
          <AssetImage kind={iconKind} id={iconId} width={44} />
        </div>

        <Flex direction="col" align="start" gap="xs" className="min-w-0">
          <Flex gap="xs" align="center" className="min-w-0">
            {node.isFinalProduct && <Typography variant="h4">{node.targetIpm?.toFixed(0)}x</Typography>}
            <Typography variant="h4" className={`${node.isFinalProduct ? 'text-primary' : 'text-white'} truncate`}>
              {label}
            </Typography>
            {showBuildingCount ? <Typography variant="h4">(x{node.buildingCount})</Typography> : null}
          </Flex>

          {node.isFinalProduct || (
            <Flex gap="sm" align="center">
              <Typography variant="small" tone="soft">
                {itemLabel}
              </Typography>
              {isSupply ? (
                <Typography variant="small" tone="soft">
                  Supply {supplyCount.toFixed(1)} units/min
                </Typography>
              ) : (
                <Typography variant="small" tone="soft">
                  ({node.targetIpm?.toFixed(1)} units/min)
                </Typography>
              )}
            </Flex>
          )}
        </Flex>
      </button>
    )
  },
)

const TreeNodeRow = memo(
  ({
    node,
    itemNameMap,
    depth,
    isLast,
    ancestorLineFlags,
    isOpen,
    hasChildren,
    onToggle,
  }: {
    node: TreeNodeData
    itemNameMap: Map<string, string>
    depth: number
    isLast: boolean
    ancestorLineFlags: boolean[]
    isOpen: boolean
    hasChildren: boolean
    onToggle: () => void
  }) => (
    <div className="flex items-stretch group/row">
      <TreeLines depth={depth} isLast={isLast} ancestorLineFlags={ancestorLineFlags} />

      <div className={`flex items-center flex-1 py-2 relative ${TREE_LINE_CLASSES.INDENT_W}`}>
        {depth === 0 && <div className={`${TREE_LINE_CLASSES.INDENT_W} shrink-0`} />}
        <TreeNodeContent node={node} itemNameMap={itemNameMap} isOpen={isOpen} hasChildren={hasChildren} onToggle={onToggle} />
      </div>
    </div>
  ),
)

const TreeNodeChildren = memo(
  ({
    children,
    nodePath,
    itemNameMap,
    depth,
    ancestorLineFlags,
    isExpandedById,
    onToggle,
  }: {
    children: TreeNodeData[]
    nodePath: string
    itemNameMap: Map<string, string>
    depth: number
    ancestorLineFlags: boolean[]
    isExpandedById: Map<string, boolean>
    onToggle: (nodeId: string) => void
  }) => (
    <>
      {children.map((child, idx) => {
        const childPath = `${nodePath}.${idx}`
        return (
          <TreeNode
            key={getTreeNodeKey(childPath, child)}
            node={child}
            nodePath={childPath}
            itemNameMap={itemNameMap}
            depth={depth + 1}
            isLast={idx === children.length - 1}
            ancestorLineFlags={ancestorLineFlags}
            isExpandedById={isExpandedById}
            onToggle={onToggle}
          />
        )
      })}
    </>
  ),
)

export const TreeNode = memo(
  ({ node, nodePath, itemNameMap, depth, isLast, ancestorLineFlags, isExpandedById, onToggle }: TreeNodeProps) => {
    const children = node.children ?? []
    const hasChildren = children.length > 0

    const nodeKey = getTreeNodeKey(nodePath, node)
    const isOpen = isExpandedById.get(nodeKey) ?? true

    const nextAncestorFlags = useMemo(() => {
      if (!hasChildren) return ancestorLineFlags
      return [...ancestorLineFlags, depth > 0 ? !isLast : false]
    }, [ancestorLineFlags, depth, isLast, hasChildren])

    const toggle = useCallback(() => {
      if (hasChildren) onToggle(nodeKey)
    }, [hasChildren, onToggle, nodeKey])

    return (
      <div className="flex flex-col group/node">
        <TreeNodeRow
          node={node}
          itemNameMap={itemNameMap}
          depth={depth}
          isLast={isLast}
          ancestorLineFlags={ancestorLineFlags}
          isOpen={isOpen}
          hasChildren={hasChildren}
          onToggle={toggle}
        />

        {hasChildren && (
          <div
            className={`
              transition-all duration-300 ease-out
              ${isOpen ? 'opacity-100 translate-y-0 h-auto visible' : 'opacity-0 -translate-y-3 h-0 overflow-hidden invisible'}
            `}
          >
            {isOpen && (
              <TreeNodeChildren
                children={children}
                nodePath={nodePath}
                itemNameMap={itemNameMap}
                depth={depth}
                ancestorLineFlags={nextAncestorFlags}
                isExpandedById={isExpandedById}
                onToggle={onToggle}
              />
            )}
          </div>
        )}
      </div>
    )
  },
)
