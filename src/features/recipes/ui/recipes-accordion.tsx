import { Accordion, AccordionItemContent } from '@/shared/ui'
import { accordionItemStyles } from '@/shared/ui/accordion/accordionItem.styles'
import { AccordionItem } from '@heroui/react'
import { useRecipesAccordionData } from '../hooks'
import { RecipeRow } from './recipe-row'
import { RecipeAccordionHeader } from './recipe-accordion-header'

export const RecipesAccordion = () => {
  const { buildingsWithRecipes, itemMap, getUnlockInfo } = useRecipesAccordionData()

  return (
    <Accordion>
      {buildingsWithRecipes.map((building) => (
        <AccordionItem
          key={building.id}
          aria-label={building.name}
          classNames={accordionItemStyles}
          title={<RecipeAccordionHeader building={building} unlockInfo={getUnlockInfo(building.name)} />}
        >
          <AccordionItemContent>
            {building.recipes?.map((recipe, index) => (
              <RecipeRow key={`${building.id}-${index}`} recipe={recipe} outputItem={itemMap.get(recipe.output.id)} itemMap={itemMap} />
            ))}
          </AccordionItemContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
