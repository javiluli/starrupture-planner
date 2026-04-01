import type { Item } from '@/shared/@types/item.type'
import type { Level } from '@/shared/@types/corporations.type'
import { AssetImage, Flex, Typography } from '@/shared/ui'
import { usePlannerTarget } from '@/features/planner'
import { Button, Chip } from '@heroui/react'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { LevelRequirements } from './level-requirements'

interface Props {
  level: Level
  itemMap: Map<string, Item>
}

const CorporationLevelRowComponent = ({ level, itemMap }: Props) => {
  const navigate = useNavigate()
  const { selectTargetItem } = usePlannerTarget()

  const handlerRedirect = (id: string) => {
    selectTargetItem(id)
    // Un ligero delay, opcional permite que el estado se sincronice antes del cambio de vista
    setTimeout(() => {
      navigate('/')
    }, 100)
  }

  return (
    <div className='rounded-lg border border-divider'>
      <Flex direction='col' align='start' gap='xl' wrap='wrap' className='px-10 py-6'>
        <LevelRequirements level={level.level} xp={level.xp} />

        <Flex gap='lg'>
          {level.components.map((c, index) => {
            const inputItem = itemMap.get(c.id)

            return (
              <Flex key={c.id} gap='lg'>
                <Flex direction='col' gap='md'>
                  <div className='flex flex-col items-center gap-2 p-2 rounded-md bg-content1 min-w-30'>
                    <Flex gap='md'>
                      <Chip size='sm' variant='bordered' color='primary'>
                        {c.points} G
                      </Chip>
                      <Typography as='span' variant='micro' tone='muted' className='text-center'>
                        x{(level.xp / c.points).toFixed(0)}
                      </Typography>
                    </Flex>

                    <AssetImage kind='items' id={c.id} width={48} />
                    <Typography as='span' variant='micro' tone='normal' className='text-center'>
                      {inputItem?.name ?? c.id}
                    </Typography>
                  </div>

                  <Button variant='solid' size='sm' onPress={() => handlerRedirect(c.id)}>
                    Open on planner
                  </Button>
                </Flex>

                {/* Separador solo si NO es el ultimo */}
                {index < level.components.length - 1 && (
                  <Typography as='span' variant='h3' tone='soft' className='font-light'>
                    OR
                  </Typography>
                )}
              </Flex>
            )
          })}
        </Flex>

        <Flex>
          <Typography variant='small' tone='muted'>
            Rewards:
          </Typography>
          {level.rewards.map((r) => (
            <Chip variant='bordered' size='sm'>
              {r.name}
            </Chip>
          ))}
        </Flex>
      </Flex>
    </div>
  )
}

export const CorporationLevelRow = memo(CorporationLevelRowComponent)
