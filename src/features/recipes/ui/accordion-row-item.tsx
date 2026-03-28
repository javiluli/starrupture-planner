import type { Building } from '@/shared/@types/production'
import { buildItemMap } from '@/shared/lib'
import { AccordionItemContent } from '@/shared/ui'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { useMemo } from 'react'
import { RecipeRow } from './components/recipe'

export const AccordionRowItem = ({ building }: { building: Building }) => {
  const items = useDataStore(dataSelectors.items)
  const itemMap = useMemo(() => buildItemMap(items), [items])

  return (
    <AccordionItemContent>
      {building.recipes?.map((recipe, index) => (
        <RecipeRow key={`${building.id}-${index}`} recipe={recipe} outputItem={itemMap.get(recipe.output.id)} itemMap={itemMap} />
      ))}
    </AccordionItemContent>
  )
}
