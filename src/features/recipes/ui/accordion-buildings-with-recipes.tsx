import { Accordion } from '@/shared/ui'
import { accordionItemStyles } from '@/shared/ui/accordion/accordionItem.styles'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { AccordionItem } from '@heroui/react'
import { useMemo } from 'react'
import { buildBuildingUnlockMap, buildingHasRecipes, getBuildingUnlockInfo } from '../lib'
import { AccordionRowItem } from './accordion-row-item'
import { RecipeAccordionHeader } from './components'

export const AccordionBuildingsWithRecipes = () => {
  const buildings = useDataStore(dataSelectors.buildings)
  const corporations = useDataStore(dataSelectors.corporations)

  const unlockMap = useMemo(() => buildBuildingUnlockMap(corporations), [corporations])

  return (
    <Accordion>
      {buildings.filter(buildingHasRecipes).map((building) => (
        <AccordionItem
          key={building.id}
          aria-label={building.name}
          classNames={accordionItemStyles}
          title={<RecipeAccordionHeader building={building} unlockInfo={getBuildingUnlockInfo(unlockMap, building.name)} />}
        >
          <AccordionRowItem building={building} />
        </AccordionItem>
      ))}
    </Accordion>
  )
}
