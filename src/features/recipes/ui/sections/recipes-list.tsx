import { dataSelectors, useDataStore } from '@/store/data.store'
import { Accordion, AccordionItem } from '@heroui/react'
import { useMemo } from 'react'
import { buildBuildingUnlockMap, buildingHasRecipes, buildItemMap, getBuildingUnlockInfo } from '../../lib'
import { RecipeAccordionHeader, RecipeRow } from '../components'

const accordionItemClasses = {
  base: 'my-2',
  trigger: 'px-4 pr-12 hover:bg-content1/30',
  content: 'px-4 pb-4 ',
  indicator: 'text-foreground/60 text-2xl',
}

export const RecipesList = () => {
  const items = useDataStore(dataSelectors.items)
  const buildings = useDataStore(dataSelectors.buildings)
  const corporations = useDataStore(dataSelectors.corporations)

  const itemMap = useMemo(() => buildItemMap(items), [items])
  const unlockMap = useMemo(() => buildBuildingUnlockMap(corporations), [corporations])

  return (
    <Accordion variant="light" selectionMode="multiple" className="gap-4">
      {buildings.filter(buildingHasRecipes).map((building) => (
        <AccordionItem
          key={building.id}
          aria-label={building.name}
          classNames={accordionItemClasses}
          title={<RecipeAccordionHeader building={building} unlockInfo={getBuildingUnlockInfo(unlockMap, building.name)} />}
        >
          <div className="grid gap-4 py-2">
            {building.recipes?.map((recipe, index) => (
              <RecipeRow key={`${building.id}-${index}`} recipe={recipe} outputItem={itemMap.get(recipe.output.id)} itemMap={itemMap} />
            ))}
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
