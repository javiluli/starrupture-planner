import { AssetImage, Flex, Typography } from '@/shared/ui'
import type { Building } from '@/shared/@types/production'
import type { BuildingUnlockInfo } from '../../../lib'
import { RecipeHeaderMeta } from './recipe-accordion-header-meta'

export const RecipeAccordionHeader = ({ building, unlockInfo }: { building: Building; unlockInfo: BuildingUnlockInfo | null }) => (
  <Flex align="center" gap="lg">
    <AssetImage kind="buildings" id={building.id} className="h-32" />
    <div className="flex-1 space-y-2">
      <Typography as="h3" variant="h3">
        {building.name}
      </Typography>
      <RecipeHeaderMeta building={building} unlockInfo={unlockInfo} />
    </div>
  </Flex>
)
