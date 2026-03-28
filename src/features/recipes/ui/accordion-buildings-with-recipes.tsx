import { Accordion } from '@/shared/ui'
import { accordionItemStyles } from '@/shared/ui/accordion/accordionItem.styles'
import { AccordionItem } from '@heroui/react'
import { getBuildingUnlockInfo } from '../lib'
import { useBuildingUnlockMap, useBuildingsWithRecipes } from '../hooks'
import { AccordionRowItem } from './accordion-row-item'
import { RecipeAccordionHeader } from './components'

export const AccordionBuildingsWithRecipes = () => {
  const buildings = useBuildingsWithRecipes()
  const unlockMap = useBuildingUnlockMap()

  return (
    <Accordion>
      {buildings.map((building) => (
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
