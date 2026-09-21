import { Accordion, AccordionItemContent } from '@/shared/ui'
import { accordionSpotlightItemStyles } from '@/shared/ui/accordion/accordion-spotlight'
import { AccordionItem } from '@heroui/react'
import { useCorporationsAccordionData } from '../hooks/use-corporations-accordion-data'
import { CorporationAccordionHeader } from './corporation-accordion-header'
import { CorporationLevelRow } from './corporation-level-row'

export const CorporationsAccordion = () => {
  const { corporationsList, itemMap } = useCorporationsAccordionData()

  return (
    <Accordion>
      {corporationsList.map((corporation) => (
        <AccordionItem
          key={corporation.id}
          aria-label={corporation.id.split('_')[0]}
          classNames={accordionSpotlightItemStyles}
          title={<CorporationAccordionHeader corporation={corporation} />}
        >
          <AccordionItemContent>
            {corporation.levels.map((level) => (
              <CorporationLevelRow key={`${corporation.id}-${level.level}`} level={level} itemMap={itemMap} />
            ))}
          </AccordionItemContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
