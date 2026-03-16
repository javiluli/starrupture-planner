import { Select, SelectItem } from '@heroui/react'
import { type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

const CATEGORY_OPTIONS = [
  { key: 'ammo', label: 'Ammo' },
  { key: 'component', label: 'Component' },
  { key: 'material', label: 'Material' },
  { key: 'processed', label: 'Processed' },
  { key: 'raw', label: 'Raw' },
]

export const CategorySelect = ({ onChange }: { onChange: (value: string) => void }) => {
  const { t } = useTranslation('items')

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    onChange(e.target.value)
  }

  return (
    <Select
      size="sm"
      variant="bordered"
      className="w-48"
      items={CATEGORY_OPTIONS}
      isClearable={true}
      placeholder={t('category-filter-label')}
      onChange={handleChange}
    >
      {(i) => (
        <SelectItem key={i.key} textValue={i.label}>
          {i.label}
        </SelectItem>
      )}
    </Select>
  )
}
