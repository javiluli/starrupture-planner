import { Progress } from '@heroui/react'

interface Props {
  heat: number
}

export const HeatStat = ({ heat }: Props) => {
  return (
    <div className="w-md flex items-end space-x-2">
      <span>🔥</span>
      <div className="flex flex-col flex-1 space-y-2">
        <span>{heat}/1000</span>
        <Progress
          classNames={{
            base: 'max-w-md',
            track: 'drop-shadow-md border border-default',
            indicator: 'bg-[#f7630c]',
          }}
          value={heat}
          maxValue={1000}
        />
      </div>
    </div>
  )
}
