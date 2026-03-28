import type { Item } from '@/shared/@types/item.type'
import type { RecipeInput } from '@/shared/@types/building.type'
import { AssetImage, Flex, Typography } from '@/shared/ui'

export const RecipeInputs = ({ inputs, itemMap }: { inputs: RecipeInput[]; itemMap: Map<string, Item> }) => (
  <div className="flex-1">
    <Typography as="span" variant="micro" tone="soft" className="mb-2">
      Inputs
    </Typography>

    <Flex wrap="wrap" gap="md" align="start">
      {inputs.length === 0 ? (
        <div className="px-4 py-2 rounded-md bg-content1">
          <Typography as="span" variant="micro" tone="soft">
            No inputs required
          </Typography>
        </div>
      ) : (
        inputs.map((input) => {
          const inputItem = itemMap.get(input.id)

          return (
            <div key={input.id} className="flex flex-col items-center gap-2 p-2 rounded-md bg-content1 min-w-30">
              <AssetImage kind="items" id={input.id} className="h-12" />

              <Typography as="span" variant="micro" tone="normal" className="text-center">
                {inputItem?.name ?? input.id}
              </Typography>

              <Typography as="span" variant="micro" tone="soft">
                {input.amount_per_minute}/min
              </Typography>
            </div>
          )
        })
      )}
    </Flex>
  </div>
)
