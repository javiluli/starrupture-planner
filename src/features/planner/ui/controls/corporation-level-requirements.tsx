import { AssetImage, Flex, Typography } from '@/shared/ui'
import { calculateCorporationLevelRequirements, formatTime, formatNumber } from '@/shared/utils'
import { sortRequirementsByTime, pickRequirementByIndex } from '@/features/planner/lib/corporation-requirements'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { Button, Card, Chip, Popover, PopoverContent, PopoverTrigger } from '@heroui/react'
import React, { useMemo, useState } from 'react'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'

export const CorporationLevelRequirements: React.FC = () => {
  const targetId = usePlannerStore(plannerSelectors.targetId)
  const targetIpm = usePlannerStore(plannerSelectors.targetIpm)
  const corporations = useDataStore(dataSelectors.corporations)

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const exportStats = useMemo(() => {
    if (!targetId || targetIpm <= 0) return []
    return calculateCorporationLevelRequirements(targetId, targetIpm, corporations)
  }, [targetId, targetIpm, corporations])

  const displayStats = useMemo(() => {
    return sortRequirementsByTime(exportStats)
  }, [exportStats])

  const { selectedStat, safeIndex } = pickRequirementByIndex(displayStats, selectedIndex)

  if (!selectedStat) {
    return (
      <Button variant="light" className="px-4 panel" isDisabled>
        Select an item to see corporation requirements
      </Button>
    )
  }

  const handleSelect = (index: number) => {
    setSelectedIndex(index)
    setIsOpen(false)
  }

  const content = (
    <PopoverContent className="p-0 border-none bg-transparent shadow-none">
      <div className="p-2 bg-background border border-divider/60 rounded-2xl overflow-y-auto max-h-100 shadow-xl">
        <Flex direction="col" gap="sm">
          {displayStats.map((stat, index) => {
            const isSelected = index === safeIndex

            return (
              <Card
                key={stat.corporationName}
                isPressable
                onPress={() => handleSelect(index)}
                className={`w-full p-3 transition-all duration-200 group border border-divider/60 shadow-none
                  ${isSelected ? 'bg-content1/40 ring-2 ring-primary/30' : 'bg-transparent hover:bg-content1/30'}
                `}
              >
                <Flex justify="between" className="mb-3">
                  <Flex gap="sm">
                    <div className="p-1.5 bg-content2 rounded-lg border border-divider/60">
                      <AssetImage kind="corporations" id={stat.corporationId} className="w-5 h-5" />
                    </div>
                    <Flex direction="col" gap="none">
                      <Typography as="span" variant="small" tone="muted" className="font-semibold">
                        {stat.corporationName}{' '}
                        <Typography as="span" variant="micro" tone="soft" className="font-bold">
                          L.{stat.level}
                        </Typography>
                      </Typography>
                    </Flex>
                  </Flex>

                  <Flex gap="sm">
                    {isSelected ? (
                      <Chip size="sm" color="primary" variant="flat">
                        Selected
                      </Chip>
                    ) : null}
                    <Chip size="sm" variant="bordered">
                      {formatNumber(stat.xpRequired)} <span className="opacity-60">xp</span>
                    </Chip>
                  </Flex>
                </Flex>

                <div className="grid grid-cols-3 gap-1 bg-content1/60 rounded-lg p-1.5">
                  <StatBox label="Time" value={formatTime(stat.timeMinutes)} />
                  <StatBox label="Units" value={formatNumber(stat.totalItemsNeeded)} />
                  <StatBox label="XP/u" value={`${stat.pointsPerItem}`} />
                </div>
              </Card>
            )
          })}
        </Flex>
      </div>
    </PopoverContent>
  )

  return (
    <Popover placement="bottom-start" isOpen={isOpen} onOpenChange={setIsOpen} offset={10} showArrow={false}>
      <PopoverTrigger>
        <Button variant="light" className="px-4 panel">
          <Flex gap="md">
            <AssetImage kind="corporations" id={selectedStat.corporationId} className="w-6 h-6" />
            <div className="px-2 py-1 bg-content1 rounded-lg font-mono space-x-2 w-fit">
              <Typography as="span" variant="small" tone="normal" className="font-semibold">
                {formatTime(selectedStat.timeMinutes)}
              </Typography>
              <Typography as="span" variant="micro" tone="soft">
                |
              </Typography>
              <Typography as="span" variant="small" tone="muted">
                {formatNumber(selectedStat.totalItemsNeeded)} units
              </Typography>
            </div>
          </Flex>
        </Button>
      </PopoverTrigger>
      {content}
    </Popover>
  )
}

const StatBox = ({ label, value }: { label: string; value: string }) => (
  <Flex direction="col" align="center" justify="center" className="py-1">
    <Typography as="span" variant="micro" tone="soft" className="tracking-tight mb-0.5">
      {label}
    </Typography>
    <Typography as="span" variant="small" tone="normal" className="font-mono font-bold">
      {value}
    </Typography>
  </Flex>
)


