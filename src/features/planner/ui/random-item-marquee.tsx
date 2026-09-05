import { AssetImage, Flex } from '@/shared/ui'
import { Marquee } from './marquee'
import { getRandomItemIds } from '@/features/planner/lib/random-items'
import { items } from '@/shared/data'
import { usePlannerTarget } from '@/features/planner/hooks/use-planner-target'
import { Link } from '@heroui/react'
import { useMemo } from 'react'

export function RandomItemMarquee() {
  const { selectTargetItem } = usePlannerTarget()

  // Genera una muestra nueva al montar el estado vacio del Planner.
  const itemList = useMemo(() => {
    return getRandomItemIds(items, 16)
  }, [])

  return (
    <Marquee animationDuration={90}>
      {(isPrimary) =>
        itemList.map((id, index) => (
          <Flex key={`${id}-${index}`} justify="center" className="w-28 shrink-0 hover:cursor-pointer">
            <Link
              tabIndex={isPrimary ? 0 : -1}
              onPress={() => {
                selectTargetItem(id)
              }}
            >
              <AssetImage
                id={id}
                kind="items"
                width={96}
                loading={isPrimary && index === 0 ? 'eager' : 'lazy'}
                fetchPriority={isPrimary && index === 0 ? 'high' : 'auto'}
              />
            </Link>
          </Flex>
        ))
      }
    </Marquee>
  )
}
