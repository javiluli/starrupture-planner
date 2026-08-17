import { TreeList } from './tree-list'
import { TreeListNode } from './tree-list-node'
import { treeListMockData, type TreeListMockNode } from './mock-data'

const CustomTreeRow = ({ node }: { node: TreeListMockNode }) => (
  <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-lg px-3 py-2">
    <div className="min-w-0 space-y-1">
      <div className="flex items-center gap-2">
        <strong className="truncate text-sm text-white">{node.label}</strong>
        {node.category ? <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300">{node.category}</span> : null}
      </div>
      {node.description ? <p className="truncate text-xs text-slate-400">{node.description}</p> : null}
    </div>

    {node.stats?.length ? (
      <div className="hidden items-center gap-2 sm:flex">
        {node.stats.map((stat) => (
          <span key={stat.label} className="rounded-md bg-blue-500/15 px-2 py-0.5 text-xs text-blue-200">
            {stat.label}: {stat.value}
          </span>
        ))}
      </div>
    ) : null}
  </div>
)

export const TreeListExample = () => (
  <TreeList data={treeListMockData} className="rounded-xl border border-slate-800 bg-slate-950 p-3">
    {(nodeProps) => (
      <TreeListNode {...nodeProps} className="hover:bg-slate-900">
        <CustomTreeRow node={nodeProps.node} />
      </TreeListNode>
    )}
  </TreeList>
)
