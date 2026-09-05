import { ProductionNodeCard } from '@/features/planner/flow/nodes/production-node-card'
import { buildRecipeLoadingPreview } from './build-recipe-loading-preview'

/** Shows the real Ceramics recipe shape while the interactive graph chunk loads. */
export function NetworkGraphSkeleton() {
  const ceramicsPreview = buildRecipeLoadingPreview('ceramics')

  return (
    <div role="status" className="relative h-full min-h-0 w-full overflow-hidden bg-background/30">
      <span className="sr-only">Loading network graph</span>

      {ceramicsPreview ? (
        <div className="flex h-full min-h-168 min-w-3xl items-center justify-center gap-40 px-16 py-8">
          <div className="flex flex-col justify-center gap-8">
            {ceramicsPreview.inputs.map((node) => (
              <ProductionNodeCard key={node.itemId} data={node} loading />
            ))}
          </div>

          <ProductionNodeCard data={ceramicsPreview.target} loading />
        </div>
      ) : null}
    </div>
  )
}
