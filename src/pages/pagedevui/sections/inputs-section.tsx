import { Typography } from '@/shared/ui'
import { Divider, Input } from '@heroui/react'
import { Section } from '../components'
import { inputVariants, sizes } from '../constant'

export const InputsSection = () => (
  <Section id="inputs" title="Inputs" subtitle="Variants, sizes, and states">
    <div className="space-y-6">
      {inputVariants.map((variant) => (
        <div key={variant} className="space-y-2">
          <Typography variant="micro" tone="soft" className="uppercase tracking-wide">
            {variant}
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            {sizes.map((size) => (
              <Input key={`${variant}-${size}`} variant={variant} size={size} label={`${variant} ${size}`} />
            ))}
            <Input variant={variant} label="Disabled" isDisabled />
          </div>
        </div>
      ))}
      <Divider className="bg-divider/60" />
    </div>
  </Section>
)
