import { dataSelectors, useDataStore } from '@/store/data.store'
import { Accordion, AccordionItem } from '@heroui/react'
import { useMemo } from 'react'
import { buildItemMap } from '../lib'
import { RecipeRow } from './components'
import { CorporationAccordionHeader } from './components/accordion'

const accordionItemClasses = {
  base: 'my-2',
  trigger: 'px-4 pr-12 hover:bg-content1/30',
  content: 'px-4 pb-4 ',
  indicator: 'text-foreground/60 text-2xl',
}

export const CorporationsList = () => {
  const items = useDataStore(dataSelectors.items)
  const corporations = useDataStore(dataSelectors.corporations)
  const toArray = Object.values(corporations)

  const itemMap = useMemo(() => buildItemMap(items), [items])

  return (
    <Accordion variant="light" selectionMode="multiple" className="gap-4">
      {toArray.map((c) => (
        <AccordionItem
          key={c.id}
          aria-label={c.id.split('_')[0]}
          classNames={accordionItemClasses}
          title={<CorporationAccordionHeader corporation={c} />}
        >
          <div className="grid gap-4 py-2">
            {c.levels.map((lvl, index) => (
              <RecipeRow key={`${c.id}-${index}`} level={lvl} itemMap={itemMap} />
            ))}
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
