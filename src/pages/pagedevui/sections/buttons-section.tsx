import { Flex, Typography } from '@/shared/ui'
import { Button, Divider } from '@heroui/react'
import { Section } from '../components'
import { buttonVariants, colors, sizes } from '../constant'

export const ButtonsSection = () => (
  <Section id="buttons" title="Buttons" subtitle="Variants, colors, and sizes">
    <div className="space-y-6">
      {buttonVariants.map((variant) => (
        <div key={variant} className="space-y-2">
          <Typography variant="micro" tone="soft" className="uppercase tracking-wide">
            {variant}
          </Typography>
          <Flex wrap="wrap">
            {colors.map((color) => (
              <Button key={`${variant}-${color}`} variant={variant === 'solid' ? undefined : variant} color={color}>
                {color}
              </Button>
            ))}
          </Flex>
        </div>
      ))}

      <Divider />

      <div className="space-y-2">
        <Typography variant="micro" tone="soft" className="uppercase tracking-wide">
          Sizes
        </Typography>
        <Flex wrap="wrap" align="center">
          {sizes.map((size) => (
            <Button key={size} size={size}>
              {size}
            </Button>
          ))}
        </Flex>
      </div>

      <div className="space-y-2">
        <Typography variant="micro" tone="soft" className="uppercase tracking-wide">
          Disabled
        </Typography>
        <Button isDisabled>Disabled</Button>
      </div>
    </div>
  </Section>
)
