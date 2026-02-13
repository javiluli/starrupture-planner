import { MagnifyingGlassIcon } from '@heroicons/react/16/solid'
import { Input } from '@heroui/react'
import { type Dispatch, type SetStateAction } from 'react'

interface Props {
  onSearchChange: Dispatch<SetStateAction<string>>
}

const ItemsSearch = ({ onSearchChange }: Props) => {
  return (
    <Input
      isClearable
      size="sm"
      type="search"
      autoComplete="off"
      placeholder="Search items"
      startContent={<MagnifyingGlassIcon className="size-6" />}
      onChange={(e) => {
        onSearchChange(e.target.value)
      }}
      onClear={() => onSearchChange('')}
      classNames={{
        base: 'max-w-full sm:max-w-[10rem]',
        input: 'text-small',
        inputWrapper: 'h-full font-normal text-default-500 bg-content2',
      }}
    />
  )
}

export default ItemsSearch
