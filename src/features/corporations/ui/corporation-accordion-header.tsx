import type { Corporation } from '@/shared/@types/corporations.type'
import { AssetImage, Flex, Typography } from '@/shared/ui'
import { CorporationAccordionMeta } from './corporation-accordion-meta'

interface Props {
  corporation: Corporation
}

export const CorporationAccordionHeader = ({ corporation }: Props) => (
  <Flex gap="lg" className="min-w-0">
    <AssetImage kind="corporations" id={corporation.id} width={80} alt="" />
    <div className="min-w-0 flex-1 space-y-2">
      <Typography as="h3" variant="h3" className="capitalize">
        {corporation.id.split('_').join(' ')}
      </Typography>
      <Typography as="p" variant="small" tone="soft">
        {corporation.description}
      </Typography>
      <CorporationAccordionMeta corporation={corporation} />
    </div>
  </Flex>
)
