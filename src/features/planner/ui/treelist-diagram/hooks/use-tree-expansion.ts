import type { TreeNodeData } from '../components/tree-node'
import { useCallback, useMemo, useState } from 'react'
import { getTreeNodeKey } from '../lib/tree-keys'

const collectKeys = (root: TreeNodeData | null, rootPath: string) => {
  const keys: string[] = []
  if (!root) return keys
  const stack: Array<{ node: TreeNodeData; path: string }> = [{ node: root, path: rootPath }]
  while (stack.length) {
    const current = stack.pop()
    if (!current) continue
    const key = getTreeNodeKey(current.path, current.node)
    keys.push(key)
    current.node.children?.forEach((child, idx) => {
      stack.push({ node: child, path: `${current.path}.${idx}` })
    })
  }
  return keys
}

export const useTreeExpansion = (root: TreeNodeData | null, rootPath: string) => {
  const [collapsedSet, setCollapsedSet] = useState<Set<string>>(() => new Set())

  const expandedMap = useMemo(() => {
    const map = new Map<string, boolean>()
    if (!root) return map

    const stack: Array<{ node: TreeNodeData; path: string }> = [{ node: root, path: rootPath }]
    while (stack.length) {
      const current = stack.pop()
      if (!current) continue
      const key = getTreeNodeKey(current.path, current.node)
      map.set(key, !collapsedSet.has(key))
      current.node.children?.forEach((child, idx) => {
        stack.push({ node: child, path: `${current.path}.${idx}` })
      })
    }
    return map
  }, [root, rootPath, collapsedSet])

  const toggle = useCallback((nodeId: string) => {
    setCollapsedSet((prev) => {
      const next = new Set(prev)
      if (next.has(nodeId)) next.delete(nodeId)
      else next.add(nodeId)
      return next
    })
  }, [])

  const expandAll = useCallback(() => {
    setCollapsedSet(new Set())
  }, [])

  const collapseAll = useCallback(() => {
    const keys = collectKeys(root, rootPath)
    setCollapsedSet(new Set(keys))
  }, [root, rootPath])

  return {
    expandedMap,
    toggle,
    expandAll,
    collapseAll,
  }
}
