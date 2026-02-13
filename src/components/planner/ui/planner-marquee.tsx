import { ItemImage } from '@/components/ui/asset-image'
import { Marquee } from '@/components/ui/marquee'
import { useDataStore } from '@/store/data.store'
import { usePlannerStore } from '@/store/planner.store'
import { Link } from '@heroui/react'
import { useMemo } from 'react'

function getRandomItems(array: string[], count = 16) {
  const shuffled = [...array].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function PlannerMarquee() {
  const items = useDataStore((state) => state.items)
  const setTargetId = usePlannerStore((state) => state.setTargetId)

  //  Generamos la lista aleatoria de IDs de forma segura
  const itemList = useMemo(() => {
    const ids = items.map((i) => i.id)
    return getRandomItems(ids)
  }, [items])

  return (
    <Marquee animationDuration={90}>
      {itemList.map((id, idx) => (
        <div key={`$${id}-${idx}`} className="flex w-28 shrink-0 items-center justify-center hover:cursor-pointer">
          <Link
            onPress={() => {
              setTargetId(id)
            }}
          >
            <ItemImage id={id} className="w-full h-24" />
          </Link>
        </div>
      ))}
    </Marquee>
  )
}
