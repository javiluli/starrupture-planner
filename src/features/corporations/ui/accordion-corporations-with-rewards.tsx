import { Accordion } from '@/shared/ui'
import { accordionItemStyles } from '@/shared/ui/accordion/accordionItem.styles'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { AccordionItem } from '@heroui/react'
import { AccordionRowItem } from './accordion-row-item'
import { CorporationAccordionHeader } from './components/accordion'

export const AccordionCorporationsWithRewards = () => {
  const corporations = useDataStore(dataSelectors.corporations)

  return (
    <Accordion>
      {Object.values(corporations).map((corporation) => (
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
