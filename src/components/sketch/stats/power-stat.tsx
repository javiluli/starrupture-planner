import { Progress } from '@heroui/react'

interface Props {
  maxPower: number // Este valor indica cuanta energia hay disponible
  restPower: number // Este valor indica cuanta energia se esta consumiendo
}

export const PowerStat = ({ maxPower, restPower }: Props) => {
  return (
    <div className="w-md flex items-end space-x-2">
      <span>⚡</span>
      <div className="flex flex-col flex-1 space-y-2">
        <span>
          {maxPower}/{restPower}
        </span>
        <Progress
          classNames={{
            base: 'max-w-md',
            track: 'drop-shadow-md border border-default',
            indicator: 'bg-[#ffc83d]',
          }}
          value={restPower}
          maxValue={maxPower}
        />
      </div>
    </div>
  )
}
