import { CHRadio } from '@/components/ui/custom-heroui/Radio'
import { Divider, RadioGroup } from '@heroui/react'

interface Props {
  value: string
  onChange: (value: string) => void
}

const CategoryFilter = ({ value, onChange }: Props) => {
  return (
    <RadioGroup orientation="horizontal" className="h-7" value={value} onValueChange={(val) => onChange(val)}>
      <CHRadio category="default" value="all">
        All items
      </CHRadio>
      <Divider orientation="vertical" />
      <CHRadio category="ammo" value="ammo">
        Ammo
      </CHRadio>
      <CHRadio category="component" value="component">
        Component
      </CHRadio>
      <CHRadio category="material" value="material">
        Material
      </CHRadio>
      <CHRadio category="processed" value="processed">
        Processed
      </CHRadio>
      <CHRadio category="raw" value="raw">
        Raw
      </CHRadio>
    </RadioGroup>
  )
}

export default CategoryFilter
