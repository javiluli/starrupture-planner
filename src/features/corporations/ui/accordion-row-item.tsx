import type { Corporation } from '@/shared/@types/production'
import { buildItemMap } from '@/shared/lib'
import { AccordionItemContent } from '@/shared/ui'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { useMemo } from 'react'
import { RecipeRow } from './components'

export const AccordionRowItem = ({ corporation }: { corporation: Corporation }) => {
  const items = useDataStore(dataSelectors.items)
  const itemMap = useMemo(() => buildItemMap(items), [items])

  return (
    <AccordionItemContent>
      {corporation.levels.map((lvl, index) => (
        <RecipeRow key={`${corporation.id}-${index}`} level={lvl} itemMap={itemMap} />
      ))}
    </AccordionItemContent>
  )
}
