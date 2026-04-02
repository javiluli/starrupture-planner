import { AssetImage, Flex, Marquee } from '@/shared/ui'
import { pickRandomItems } from '@/shared/utils'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { usePlannerTarget } from '@/features/planner'
import { Link } from '@heroui/react'
import { useMemo } from 'react'

export function RandomItemMarquee() {
  const items = useDataStore(dataSelectors.items)
  const { selectTargetItem } = usePlannerTarget()

  //  Generamos la lista aleatoria de IDs de forma segura
  const itemList = useMemo(() => {
    const ids = items.map((i) => i.id)
    return pickRandomItems(ids, 16)
  }, [items])

  return (
    <Marquee animationDuration={90}>
      {itemList.map((id, idx) => (
        <Flex key={`$${id}-${idx}`} justify='center' className='w-28 shrink-0 hover:cursor-pointer'>
          <Link
            onPress={() => {
              selectTargetItem(id)
            }}
          >
            <AssetImage id={id} kind='items' width={96} />
          </Link>
        </Flex>
      ))}
    </Marquee>
  )
}
