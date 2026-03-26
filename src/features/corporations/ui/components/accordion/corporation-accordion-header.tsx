import type { Corporation } from '@/shared/@types/production'
import { AssetImage, Flex, Typography } from '@/shared/ui'
import { CorporationHeaderMeta } from './corporation-accordion-header-meta'

interface Props {
  corporation: Corporation
}

export const CorporationAccordionHeader = ({ corporation }: Props) => (
  <Flex align="center" gap="lg">
    <AssetImage kind="corporations" id={corporation.id} className="h-32" />
    <div className="flex-1 space-y-2">
      <Typography as="h3" variant="h3" className="capitalize">
        {corporation.id.split('_').join(' ')}
      </Typography>
      <Typography as="h3" variant="h4" tone="soft" className="capitalize">
        {corporation.description}
      </Typography>
      <CorporationHeaderMeta corporation={corporation} />
    </div>
  </Flex>
)
