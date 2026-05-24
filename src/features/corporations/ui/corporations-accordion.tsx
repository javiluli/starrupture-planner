import { Accordion, AccordionItemContent } from '@/shared/ui'
import { accordionItemStyles } from '@/shared/ui/accordion/accordionItem.styles'
import { AccordionItem } from '@heroui/react'
import { useCorporationsAccordionData } from '../hooks'
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
          classNames={accordionItemStyles}
          title={<CorporationAccordionHeader corporation={corporation} />}
        >
          <AccordionItemContent>
            {corporation.levels.map((level, index) => (
              <CorporationLevelRow key={`${corporation.id}-${index}`} level={level} itemMap={itemMap} />
            ))}
          </AccordionItemContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
