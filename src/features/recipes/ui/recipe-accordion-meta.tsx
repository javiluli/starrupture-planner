import type { ReactNode } from 'react'
import { Chip, Divider } from '@heroui/react'
import { Flame, Zap } from 'lucide-react'
import { AssetImage, Flex, Typography } from '@/shared/ui'
import type { Building } from '@/shared/@types/building.type'
import type { BuildingUnlockInfo } from '@/features/recipes/types'

const RecipesChip = ({ count }: { count: number }) => <Chip variant="solid">{count} recipes</Chip>

const StatBadge = ({ icon, value }: { icon: ReactNode; value: number }) => (
  <Flex align="center" gap="xs">
    {icon}
    <Typography as="span" variant="small" tone="soft">
      {value}
    </Typography>
  </Flex>
)

const UnlockBadge = ({ unlockInfo }: { unlockInfo: BuildingUnlockInfo | null }) => (
  <Flex align="center" gap="xs">
    {unlockInfo ? (
      <>
        <AssetImage kind="corporations" id={unlockInfo.corporationId} width={20} />
        <Typography as="span" variant="small" tone="soft">
          {unlockInfo.corporationName} L.{unlockInfo.corporationLevel}
        </Typography>
      </>
    ) : null}
  </Flex>
)

export const RecipeAccordionMeta = ({ building, unlockInfo }: { building: Building; unlockInfo: BuildingUnlockInfo | null }) => (
  <Flex gap="md" align="center" wrap="wrap">
    <RecipesChip count={building.recipes?.length ?? 0} />
    <Flex align="center" wrap="wrap" className="h-4">
      <StatBadge icon={<Zap size={14} className="text-warning" />} value={building.power} />
      <Divider orientation="vertical" />
      <StatBadge icon={<Flame size={14} className="text-danger" />} value={building.heat} />
      <Divider orientation="vertical" />
      <UnlockBadge unlockInfo={unlockInfo} />
    </Flex>
  </Flex>
)
