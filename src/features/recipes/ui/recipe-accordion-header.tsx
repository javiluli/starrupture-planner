import type { BuildingUnlockInfo } from '@/features/recipes/types'
import type { Building } from '@/shared/@types/building.type'
import { AssetImage, Flex, Typography } from '@/shared/ui'
import { RecipeAccordionMeta } from './recipe-accordion-meta'

export const RecipeAccordionHeader = ({ building, unlockInfo }: { building: Building; unlockInfo: BuildingUnlockInfo | null }) => (
  <Flex align="center" gap="lg">
    <AssetImage kind="buildings" id={building.id} width={128} />
    <div className="flex-1 space-y-2">
      <Typography as="h3" variant="h3">
        {building.name}
      </Typography>
      <RecipeAccordionMeta building={building} unlockInfo={unlockInfo} />
    </div>
  </Flex>
)
