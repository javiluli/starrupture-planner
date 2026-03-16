import { AssetImage, Flex, Marquee } from '@/shared/ui'
import { pickRandomItems } from '@/shared/utils'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'
import { Link } from '@heroui/react'
import { useMemo } from 'react'

export function RandomItemMarquee() {
  const items = useDataStore(dataSelectors.items)
  const setTargetId = usePlannerStore(plannerSelectors.setTargetId)

  //  Generamos la lista aleatoria de IDs de forma segura
  const itemList = useMemo(() => {
    const ids = items.map((i) => i.id)
    return pickRandomItems(ids, 16)
  }, [items])

  return (
    <Marquee animationDuration={90}>
      {itemList.map((id, idx) => (
        <Flex key={`$${id}-${idx}`} justify="center" className="w-28 shrink-0 hover:cursor-pointer">
          <Link
            onPress={() => {
              setTargetId(id)
            }}
          >
            <AssetImage id={id} kind="items" className="h-24" />
          </Link>
        </Flex>
      ))}
    </Marquee>
  )
}
