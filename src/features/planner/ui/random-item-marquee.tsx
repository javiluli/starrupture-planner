import { AssetImage, Flex } from '@/shared/ui'
import { Marquee } from './marquee'
import { getRandomItemIds } from '@/features/planner/lib/random-items'
import { itemById, items } from '@/shared/data'
import { usePlannerTarget } from '@/features/planner/hooks/use-planner-target'
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
        itemList.map((id, index) => {
          const itemName = itemById.get(id)?.name ?? id.replaceAll('_', ' ')

          return (
            <Flex key={`${id}-${index}`} justify="center" className="w-28 shrink-0">
              <button
                type="button"
                aria-label={`Select ${itemName} as production target`}
                data-testid={isPrimary ? undefined : 'planner-marquee-copy-item'}
                tabIndex={isPrimary ? 0 : -1}
                className="touch-manipulation rounded-lg border-0 bg-transparent p-0 transition-opacity hover:cursor-pointer hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onMouseDown={isPrimary ? undefined : (event) => event.preventDefault()}
                onClick={() => {
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
              </button>
            </Flex>
          )
        })
      }
    </Marquee>
  )
}
