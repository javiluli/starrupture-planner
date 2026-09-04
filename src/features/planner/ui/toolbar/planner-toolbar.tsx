import { Flex } from '@/shared/ui'
import { CorporationLevelRequirements } from './corporation-level-requirements'
import { PlannerStats } from './planner-stats'
import { TargetItemSelect } from './target-item-select'
import { TargetRateInput } from './target-rate-input'

/** Complete control bar for selecting and inspecting the active production target. */
export const PlannerToolbar = () => (
  <Flex wrap="wrap" gap="md">
    <Flex>
      <TargetItemSelect />
      <TargetRateInput />
    </Flex>
    <PlannerStats />
    <CorporationLevelRequirements />
  </Flex>
)
