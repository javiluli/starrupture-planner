import type { Item } from '@/shared/@types/item.type'
import type { Recipe } from '@/shared/@types/building.type'
import { AssetImage, Typography } from '@/shared/ui'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'
import { Button } from '@heroui/react'
import { useNavigate } from 'react-router-dom'

interface Props {
  output: Recipe['output']
  outputItem?: Item
}

export const RecipeOutput = ({ output, outputItem }: Props) => {
  const navigate = useNavigate()
  const setTargetId = usePlannerStore(plannerSelectors.setTargetId)

  const handlerRedirect = (id: string) => {
    setTargetId(id)
    // Un ligero delay, opcional permite que el estado se sincronice antes del cambio de vista
    setTimeout(() => {
      navigate('/')
    }, 100)
  }

  return (
    <div className="flex flex-col items-center gap-2 min-w-30">
      <Typography as="span" variant="micro" tone="soft" className="mb-2">
        Output
      </Typography>
      <AssetImage kind="items" id={output.id} className="h-18" />
      <Typography as="span" variant="small" tone="normal" className="font-semibold text-center">
        {outputItem?.name ?? output.id}
      </Typography>
      <Typography as="span" variant="micro" tone="soft">
        {output.amount_per_minute}/min
      </Typography>
      {outputItem?.type !== 'raw' && (
        <Button variant="solid" size="sm" onPress={() => handlerRedirect(output.id)}>
          Open on planner
        </Button>
      )}
    </div>
  )
}
