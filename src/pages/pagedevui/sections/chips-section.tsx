import { Flex, Typography } from '@/shared/ui'
import { Chip, Divider } from '@heroui/react'
import { Section } from '../components'
import { chipVariants, colors, sizes } from '../constant'

export const ChipsSection = () => (
  <Section id="chips" title="Chips" subtitle="Variants, colors, and sizes">
    <div className="space-y-6">
      {chipVariants.map((variant) => (
        <div key={variant} className="space-y-2">
          <Typography variant="micro" tone="soft" className="uppercase tracking-wide">
            {variant}
          </Typography>
          <Flex wrap="wrap">
            {colors.map((color) => (
              <Chip key={`${variant}-${color}`} variant={variant} color={color}>
                {color}
              </Chip>
            ))}
          </Flex>
        </div>
      ))}

      <Divider />

      <Flex wrap="wrap">
        {sizes.map((size) => (
          <Chip key={size} size={size} color="primary">
            {size}
          </Chip>
        ))}
      </Flex>
    </div>
  </Section>
)
