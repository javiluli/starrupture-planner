import { Flex, Typography } from '@/shared/ui'
import { Section } from '../components'

export const TypographySection = () => (
  <Section id="typography" title="Typography" subtitle="Scale, tone, and emphasis">
    <Flex direction="col" gap="sm" align="start">
      <Typography variant="display">Display Text</Typography>
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="h4">Heading 4</Typography>
      <Typography>Body text example for standard UI copy.</Typography>
      <Typography variant="small" tone="muted">
        Small muted helper text
      </Typography>
      <Typography variant="micro" tone="soft">
        Micro label text
      </Typography>
    </Flex>
  </Section>
)
