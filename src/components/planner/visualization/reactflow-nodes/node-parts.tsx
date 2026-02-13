import { FlameIcon, ZapIcon } from 'lucide-react'

/**
 * Nombre de building como cabezal en el Node
 */
export function NodeHeader({ title }: { title: string }) {
  return <span className="text-lg font-bold text-foreground">{title}</span>
}

interface NodeStatBadgeProps {
  icon: React.ElementType
  value: number
  color: string
}
/**
 * Badge de stats (power/heat) del building que consume
 */
function NodeStatBadge({ icon: Icon, value, color }: NodeStatBadgeProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={16} className={color} str />
      <span className={`text-md font-mono font-bold ${color}`}>{value}</span>
    </div>
  )
}

interface NodeStatsContainerProps {
  buildingPower: number
  buildingHeat: number
}
/**
 * Contenedor que agruupa los budges del building mostrando el power y heat que consume
 *
 * @param buildingPower Cantidad de energia que consume de la base
 * @param buildingHeat Cantidad de calentamiento que produce en la base
 */
export function NodeStatsContainer({ buildingPower, buildingHeat }: NodeStatsContainerProps) {
  return (
    <div className="mb-0 flex items-center gap-2">
      <NodeStatBadge icon={ZapIcon} value={buildingPower} color="text-warning" />
      <NodeStatBadge icon={FlameIcon} value={buildingHeat} color="text-danger" />
    </div>
  )
}

interface NodeBuildingCountBadgeProps {
  buildingLoad: number
  buildingCount: number
}
/**
 * Contado de maquinas requeridas a construiri, este puede ser un numero entero o decimal,
 * segun sea, mostrara un budge u otro, teniendo rpeferencia el que tenga un numero entero
 * mostandolo con un degradado de color
 *
 * @param buildingLoad Contador de building exatos, con deicmales (Ej. 1.55)
 * @param buildingCount Contador de building a construir (Ej. 2)
 */
export function NodeBuildingCountBadge({ buildingLoad, buildingCount }: NodeBuildingCountBadgeProps) {
  return (
    <>
      {buildingLoad % 1 !== 0 ? (
        <div className="bg-primary px-3 py-1 rounded-lg text-foreground">
          <strong>x{buildingLoad.toFixed(2)}</strong>
        </div>
      ) : (
        <div className="bg-linear-90 from-secondary to-primary px-3 py-1 rounded-lg text-foreground ring-3 ring-secondary">
          <strong>x{buildingCount.toFixed(1)}</strong>
        </div>
      )}
    </>
  )
}

/**
 * COMPONENT: Badge de output rate
 */
interface NodeBuildingRateProps {
  itemName: string
  baseIpm: number
}
export function NodeBuildingRate({ itemName, baseIpm }: NodeBuildingRateProps) {
  return (
    <div className="flex gap-3 items-center">
      <div className="justify-between items-center">
        <div className="text-md text-foreground/80 font-semibold">{itemName}</div>
        <div className="text-success text-sm font-semibold">{baseIpm.toFixed(1)}/min</div>
      </div>
    </div>
  )
}
