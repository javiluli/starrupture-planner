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
  itemMap: Map<string, Item>
}

const RecipeRowComponent = ({ recipe, outputItem, itemMap }: Props) => (
  <div className="rounded-lg border border-divider">
    <Flex align="center" gap="xl" wrap="wrap" className="px-10 py-6">
      <RecipeOutput output={recipe.output} outputItem={outputItem} />
      <ChevronLeft size={32} className="text-foreground" />
      <RecipeInputs inputs={recipe.inputs} itemMap={itemMap} />
    </Flex>
  </div>
)

export const RecipeRow = memo(RecipeRowComponent)
