import { Accordion } from '@/shared/ui'
import { accordionItemStyles } from '@/shared/ui/accordion/accordionItem.styles'
import { AccordionItem } from '@heroui/react'
import { AccordionRowItem } from './accordion-row-item'
import { CorporationAccordionHeader } from './components/accordion'
import { useCorporationsList } from '../hooks'

export const AccordionCorporationsWithRewards = () => {
  const corporations = useCorporationsList()

  return (
    <Accordion>
      {corporations.map((corporation) => (
        <AccordionItem
          key={corporation.id}
          aria-label={corporation.id.split('_')[0]}
          classNames={accordionItemStyles}
          title={<CorporationAccordionHeader corporation={corporation} />}
        >
          <AccordionRowItem corporation={corporation} />
        </AccordionItem>
      ))}
    </Accordion>
  )
}
