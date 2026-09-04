import { useOpenPlanner } from '@/features/planner'
import type { Level } from '@/shared/@types/corporations.type'
import type { Item } from '@/shared/@types/item.type'
import { AssetImage, Flex, Typography } from '@/shared/ui'
import { Button, Chip } from '@heroui/react'
import { memo } from 'react'
import { getCorporationLevelAnchorId } from '../lib/corporation-level-navigation'
import { LevelRequirements } from './level-requirements'

interface Props {
  corporationId: string
  level: Level
  itemMap: Map<string, Item>
  isTargeted?: boolean
}

const CorporationLevelRowComponent = ({ corporationId, level, itemMap, isTargeted = false }: Props) => {
  const openPlanner = useOpenPlanner()

  return (
    <div
      id={getCorporationLevelAnchorId(corporationId, level.level)}
      tabIndex={-1}
      className={`scroll-mt-24 rounded-lg border transition-colors focus:outline-none ${
        isTargeted ? 'border-primary bg-primary/5 ring-1 ring-primary/40' : 'border-divider'
      }`}
    >
      <Flex direction="col" align="start" gap="xl" wrap="wrap" className="px-10 py-6">
        <LevelRequirements level={level.level} xp={level.xp} />

        <Flex gap="lg">
          {level.components.map((component, index) => {
            const inputItem = itemMap.get(component.id)

            return (
              <Flex key={component.id} gap="lg">
                <Flex direction="col" gap="md">
                  <div className="flex min-w-30 flex-col items-center gap-2 rounded-md bg-content1 p-2">
                    <Flex gap="md">
                      <Chip size="sm" variant="bordered" color="primary">
                        {component.points} G
                      </Chip>
                      <Typography as="span" variant="micro" tone="muted" className="text-center">
                        x{(level.xp / component.points).toFixed(0)}
                      </Typography>
                    </Flex>

                    <AssetImage kind="items" id={component.id} width={48} />
                    <Typography as="span" variant="micro" tone="normal" className="text-center">
                      {inputItem?.name ?? component.id}
                    </Typography>
                  </div>

                  <Button variant="solid" size="sm" onPress={() => openPlanner(component.id)}>
                    Open on planner
                  </Button>
                </Flex>

                {index < level.components.length - 1 && (
                  <Typography as="span" variant="h3" tone="soft" className="font-light">
                    OR
                  </Typography>
                )}
              </Flex>
            )
          })}
        </Flex>

        <Flex>
          <Typography variant="small" tone="muted">
            Rewards:
          </Typography>
          {level.rewards.map((reward) => (
            <Chip key={reward.name} variant="bordered" size="sm">
              {reward.name}
            </Chip>
          ))}
        </Flex>
      </Flex>
    </div>
  )
}

export const CorporationLevelRow = memo(CorporationLevelRowComponent)
