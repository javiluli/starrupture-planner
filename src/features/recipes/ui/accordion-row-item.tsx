import type { Building } from '@/shared/@types/building.type'
import { AccordionItemContent } from '@/shared/ui'
import { useItemMap } from '@/shared/hooks'
import { RecipeRow } from './components/recipe'

export const AccordionRowItem = ({ building }: { building: Building }) => {
  const itemMap = useItemMap()

  return (
    <AccordionItemContent>
      {building.recipes?.map((recipe, index) => (
        <RecipeRow key={`${building.id}-${index}`} recipe={recipe} outputItem={itemMap.get(recipe.output.id)} itemMap={itemMap} />
      ))}
    </AccordionItemContent>
  )
}
