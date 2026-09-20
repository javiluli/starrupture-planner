import { ChevronLeft } from 'lucide-react'
import { memo } from 'react'
import { Flex } from '@/shared/ui'
import type { Item } from '@/shared/@types/item.type'
import type { Recipe } from '@/shared/@types/building.type'
import { RecipeOutput } from './recipe-output'
import { RecipeInputs } from './recipe-inputs'

interface Props {
  recipe: Recipe
  outputItem?: Item
  itemMap: ReadonlyMap<string, Item>
}

const RecipeRowComponent = ({ recipe, outputItem, itemMap }: Props) => (
  <div className="min-w-0 rounded-lg border border-divider/65 border-t-divider bg-content1/55">
    <Flex direction="col" align="stretch" gap="md" className="p-4 lg:flex-row lg:items-center lg:gap-4">
      <RecipeOutput output={recipe.output} outputItem={outputItem} />
      <ChevronLeft aria-hidden size={24} className="mx-auto shrink-0 rotate-90 text-foreground/70 lg:mx-0 lg:rotate-0" />
      <RecipeInputs inputs={recipe.inputs} itemMap={itemMap} />
    </Flex>
  </div>
)

export const RecipeRow = memo(RecipeRowComponent)
