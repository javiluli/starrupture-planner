import { ItemImage } from '@/components/ui/asset-image'
import { type OrbitalExportSystemNodeData } from '@/types/production'
import { Image } from '@heroui/react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { FlameIcon, ZapIcon } from 'lucide-react'
import img from '/assets/icons/buildings/orbital_cargo_launcher.png'

export const OrbitalExportSystemNode = ({ data, selected }: NodeProps) => {
  const { buildingPower, buildingHeat, buildingCount, exportItemId, exportItemName } = data as OrbitalExportSystemNodeData

  return (
    <div
      className="relative w-56 flex flex-col space-y-3 bg-content1 text-foreground p-4 rounded-2xl shadow-md"
      style={{
        border: `1px solid ${selected ? '#3b82f6' : '#373a40'}`,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#ffffff' }} />
      <Handle type="source" position={Position.Right} className="opacity-0" />

      <div className="flex flex-col items-center gap-2 pb-1.5 mb-2">
        <span className="text-lg font-bold text-foreground">Orbital Export System</span>
        <Image alt={`building__orbital_cargo_launcher`} src={img} className="w-full h-32" />
      </div>

      <div className="flex gap-3 items-center">
        <div className="flex bg-content2 rounded-2xl">
          <ItemImage id={exportItemId} className="h-10" />
        </div>
        <div>
          <div className="text-[14px] font-semibold">{exportItemName}</div>
          <div className="text-success text-[12px] font-semibold">10.0/m</div>
        </div>
      </div>

      <div className="mb-0 flex items-center justify-between">
        {/* TOP LEFT: Power/Heat */}
        <div className="flex space-x-2">
          {/* Power */}
          <div className="flex items-start justify-start">
            <div className="flex items-center gap-1.5">
              <ZapIcon className="size-4 text-warning" />
              <span className="text-sm font-mono font-bold text-warning">{buildingPower}</span>
            </div>
          </div>
          {/* Heat */}
          <div className="flex items-start justify-start">
            <div className="flex items-center gap-1.5">
              <FlameIcon className="size-4 text-danger" />
              <span className="text-sm font-mono font-bold text-danger">{buildingHeat}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Elemetos "absolute" */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2">
        <div className="bg-linear-90 from-secondary to-primary px-3 py-1 rounded-lg text-foreground text-sm ring-2 ring-secondary">
          <strong>x{buildingCount.toFixed(1)}</strong>
        </div>
      </div>
    </div>
  )
}
