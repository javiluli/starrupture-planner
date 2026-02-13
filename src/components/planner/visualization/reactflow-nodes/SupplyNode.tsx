import { ItemImage } from '@/components/ui/asset-image'
import { Handle, Position } from '@xyflow/react'

export function SupplyNode({ data }: { data: any }) {
  return (
    <div className="bg-zinc-900 border-2 border-success p-3 rounded-xl shadow-lg w-40">
      {/* Añadimos 'nodrag' a la clase para que al escribir no se mueva el nodo */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-bold text-success uppercase tracking-tighter italic">External Supply</span>

        <div className="bg-content2 rounded-2xl">
          <ItemImage id={data.itemId} className="w-full h-26" />
        </div>

        <div className="text-center w-full">
          <p className="text-xs text-foreground font-bold truncate ">{data.itemName}</p>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-green-500" />
    </div>
  )
}
