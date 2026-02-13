import { BuildingImage } from '@/components/ui/asset-image'
import { useDataStore } from '@/store/data.store'
import { Select, SelectItem } from '@heroui/react'
import { type ChangeEvent, type Dispatch, type SetStateAction } from 'react'

interface Props {
  onBuildingChange: Dispatch<SetStateAction<string>>
}

const ItemsBuildingFilter = ({ onBuildingChange }: Props) => {
  const buildings = useDataStore((state) => state.buildings)

  const data = buildings.filter(
    (b) => b.type !== 'generator' && b.type !== 'transport' && b.type !== 'temperature' && b.type !== 'habitat' && b.type !== 'defense',
  )

  function handlerChange(e: ChangeEvent<HTMLSelectElement>) {
    onBuildingChange(e.target.value)
  }

  return (
    <Select
      size="sm"
      className="max-w-3xs"
      items={data}
      isClearable={true}
      placeholder="Select a building filter"
      maxListboxHeight={500}
      onChange={handlerChange}
    >
      {(b) => (
        <SelectItem key={b.id} textValue={b.name}>
          <div className="flex gap-2 items-center">
            <BuildingImage id={b.id} className="h-8 shrink-0" />
            <div className="flex flex-col">
              <span className="text-small">{b.name}</span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>
  )
}

export default ItemsBuildingFilter
