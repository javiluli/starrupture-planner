import { Flex, AssetImage, Typography } from '@/shared/ui'
import { Handle, Position } from '@xyflow/react'

export function SupplyNode({ data }: { data: any }) {
  return (
    <div className="bg-zinc-900 border-2 border-success p-3 rounded-xl shadow-lg w-40">
      {/* Anadimos 'nodrag' a la clase para que al escribir no se mueva el nodo */}
      <Flex direction="col" align="center" gap="sm">
        <Typography as="span" variant="micro" tone="normal" className="text-success uppercase tracking-tighter italic">
          External Supply
        </Typography>

        <div className="bg-content2 rounded-2xl">
          <AssetImage kind="items" id={data.itemId} className="w-full h-26" />
        </div>

        <div className="text-center w-full">
          <Typography as="span" variant="micro" tone="normal" className="font-bold truncate">
            {data.itemName}
          </Typography>
        </div>
      </Flex>

      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-green-500" />
    </div>
  )
}

