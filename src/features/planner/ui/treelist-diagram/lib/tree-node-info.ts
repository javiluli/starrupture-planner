import type { IconKind } from '@/shared/ui/asset-image'
import type { TreeNodeData } from '../components/tree-node'

const getItemName = (itemMap: Map<string, string>, itemId: string) => itemMap.get(itemId) ?? itemId

export const getTreeNodeInfo = (node: TreeNodeData, itemNameMap: Map<string, string>) => {
  const isSupply = Boolean(node.isSupply)
  const itemLabel = getItemName(itemNameMap, node.itemId)
  const label = isSupply ? itemLabel : node.isFinalProduct ? itemLabel : node.buildingName
  const iconKind: IconKind = isSupply || node.isFinalProduct ? 'items' : 'buildings'
  const iconId = isSupply || node.isFinalProduct ? node.itemId : (node.buildingId as string)
  const showBuildingCount = !node.isFinalProduct && !isSupply

  return {
    isSupply,
    label,
    itemLabel,
    iconKind,
    iconId,
    showBuildingCount,
    supplyCount: node.supplyCount ?? 0,
  }
}
