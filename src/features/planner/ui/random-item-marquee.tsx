import { AssetImage, Flex } from '@/shared/ui'
import { Marquee } from './marquee'
import { getRandomItemIds } from '@/features/planner/lib/random-items'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { usePlannerTarget } from '@/features/planner'
import { Link } from '@heroui/react'
import { useMemo } from 'react'

export function RandomItemMarquee() {
  const items = useDataStore(dataSelectors.items)
  const { selectTargetItem } = usePlannerTarget()

  // Genera una muestra nueva al montar el estado vacio del Planner.
  const itemList = useMemo(() => {
    return getRandomItemIds(items, 16)
  }, [items])

  return (
    <Marquee animationDuration={90}>
      {itemList.map((id, index) => (
        <Flex key={`${id}-${index}`} justify="center" className="w-28 shrink-0 hover:cursor-pointer">
          <Link
            onPress={() => {
              selectTargetItem(id)
            }}
          >
            <AssetImage id={id} kind="items" width={96} />
          </Link>
        </Flex>
      ))}
    </Marquee>
  )
}
