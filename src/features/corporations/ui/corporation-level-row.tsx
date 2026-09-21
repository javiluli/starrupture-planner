import { useOpenPlanner } from '@/features/planner'
import type { Level } from '@/shared/@types/corporations.type'
import type { Item } from '@/shared/@types/item.type'
import { AssetImage, Flex, Typography } from '@/shared/ui'
import { Button, Chip } from '@heroui/react'
import { Fragment, memo } from 'react'
import { LevelRequirements } from './level-requirements'

interface Props {
  level: Level
  itemMap: ReadonlyMap<string, Item>
}

const CorporationLevelRowComponent = ({ level, itemMap }: Props) => {
  const openPlanner = useOpenPlanner()

  return (
    <div className="w-full min-w-0 rounded-lg border border-divider">
      <Flex direction="col" align="start" gap="xl" className="w-full min-w-0 px-4 py-5 sm:px-10 sm:py-6">
        <LevelRequirements level={level.level} xp={level.xp} />

        <Flex direction="col" align="start" gap="md" wrap="wrap" className="w-full min-w-0 sm:flex-row sm:items-center">
          {level.components.map((component, index) => {
            const inputItem = itemMap.get(component.id)

            return (
              <Fragment key={component.id}>
                {index > 0 && (
                  <Typography as="span" variant="h3" tone="soft" className="self-center font-light">
                    OR
                  </Typography>
                )}
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

                    <AssetImage kind="items" id={component.id} width={48} alt="" />
                    <Typography as="span" variant="micro" tone="normal" className="text-center">
                      {inputItem?.name ?? component.id}
                    </Typography>
                  </div>

                  <Button variant="solid" size="sm" onPress={() => openPlanner(component.id)}>
                    Open on planner
                  </Button>
                </Flex>
              </Fragment>
            )
          })}
        </Flex>

        <Flex align="start" wrap="wrap" className="w-full min-w-0">
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
