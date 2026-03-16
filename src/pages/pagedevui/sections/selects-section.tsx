import { Typography } from '@/shared/ui'
import { Select, SelectItem } from '@heroui/react'
import { Section } from '../components'
import { inputVariants, sizes } from '../constant'

export const SelectsSection = () => (
  <Section id="selects" title="Select" subtitle="Variants, sizes, and states">
    <div className="space-y-6">
      {inputVariants.map((variant) => (
        <div key={variant} className="space-y-2">
          <Typography variant="micro" tone="soft" className="uppercase tracking-wide">
            {variant}
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            {sizes.map((size) => (
              <Select key={`${variant}-${size}`} variant={variant} size={size} label={`${variant} ${size}`}>
                <SelectItem key="a">Alpha</SelectItem>
                <SelectItem key="b">Beta</SelectItem>
                <SelectItem key="c">Gamma</SelectItem>
              </Select>
            ))}
            <Select variant={variant} label="Disabled" isDisabled>
              <SelectItem key="a">Alpha</SelectItem>
            </Select>
          </div>
        </div>
      ))}
    </div>
  </Section>
)
