import type { Corporation } from '@/shared/@types/corporations.type'
import { AssetImage, Flex, Typography } from '@/shared/ui'
import { CorporationAccordionMeta } from './corporation-accordion-meta'

interface Props {
  corporation: Corporation
}

export const CorporationAccordionHeader = ({ corporation }: Props) => (
  <Flex align="center" gap="lg">
    <AssetImage kind="corporations" id={corporation.id} width={128} />
    <div className="flex-1 space-y-2">
      <Typography as="h3" variant="h3" className="capitalize">
        {corporation.id.split('_').join(' ')}
      </Typography>
      <Typography as="h3" variant="h4" tone="soft" className="capitalize">
        {corporation.description}
      </Typography>
      <CorporationAccordionMeta corporation={corporation} />
    </div>
  </Flex>
)
