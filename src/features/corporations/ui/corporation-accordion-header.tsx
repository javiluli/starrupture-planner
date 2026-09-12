import type { Corporation } from '@/shared/@types/corporations.type'
import { AssetImage, Flex, Typography } from '@/shared/ui'
import { CorporationAccordionMeta } from './corporation-accordion-meta'

interface Props {
  corporation: Corporation
}

export const CorporationAccordionHeader = ({ corporation }: Props) => (
  <Flex direction="col" align="start" gap="lg" className="min-w-0 sm:flex-row sm:items-center">
    <AssetImage kind="corporations" id={corporation.id} width={128} alt="" />
    <div className="min-w-0 flex-1 space-y-2">
      <Typography as="h3" variant="h3" className="capitalize">
        {corporation.id.split('_').join(' ')}
      </Typography>
      <Typography as="p" variant="h4" tone="soft" className="capitalize">
        {corporation.description}
      </Typography>
      <CorporationAccordionMeta corporation={corporation} />
    </div>
  </Flex>
)
