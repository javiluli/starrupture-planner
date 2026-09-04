import { AssetImage, Flex } from '@/shared/ui'
import { Cable } from 'lucide-react'

interface BuildingIconProps {
  buildingId: string
  label: string
  width: number
}

/** Renders a building asset and keeps explicit fallbacks close to this feature. */
export const BuildingIcon = ({ buildingId, label, width }: BuildingIconProps) => {
  if (buildingId === 'zipline') {
    return (
      <Flex
        as="span"
        role="img"
        aria-label={label}
        justify="center"
        className="shrink-0 text-foreground/70"
        style={{ width, height: width }}
      >
        <Cable aria-hidden size={Math.round(width * 0.62)} />
      </Flex>
    )
  }

  return <AssetImage kind="buildings" id={buildingId} alt={label} width={width} />
}
