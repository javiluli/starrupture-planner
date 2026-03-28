import type { Corporation } from '@/shared/@types/corporations.type'
import { AccordionItemContent } from '@/shared/ui'
import { useItemMap } from '@/shared/hooks'
import { RecipeRow } from './components'

export const AccordionRowItem = ({ corporation }: { corporation: Corporation }) => {
  const itemMap = useItemMap()

  return (
    <AccordionItemContent>
      {corporation.levels.map((lvl, index) => (
        <RecipeRow key={`${corporation.id}-${index}`} level={lvl} itemMap={itemMap} />
      ))}
    </AccordionItemContent>
  )
}
