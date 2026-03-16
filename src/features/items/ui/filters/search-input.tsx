import { Input } from '@heroui/react'
import { SearchIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const SearchInput = ({ onSearch }: { onSearch: (value: string) => void }) => {
  const { t } = useTranslation('items')

  return (
    <Input
      type="search"
      size="sm"
      variant="bordered"
      className="w-3xs"
      placeholder={t('search-bar-label')}
      startContent={<SearchIcon size={18} />}
      onChange={(e) => onSearch(e.target.value)}
    />
  )
}
