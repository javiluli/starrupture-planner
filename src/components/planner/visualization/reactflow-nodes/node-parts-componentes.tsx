import { Zap, Flame } from 'lucide-react'

interface NodeData {
  name: string
  energy: number
  fuel: number
  machinesExact: number
  machinesRounded: number
  outputName: string
  outputRate: number
}

/**
 * BADGE: Energy (esquina superior izquierda)
 */
export function E1PlusEnergyBadge({ energy }: { energy: number }) {
  return (
    <div className="absolute top-0 left-0 w-24 h-16 bg-gradient-to-br from-warning/30 via-transparent to-transparent rounded-br-2xl flex items-start justify-start p-2">
      <div className="flex items-center gap-1.5">
        <Zap className="w-3.5 h-3.5 text-warning" />
        <span className="text-[10px] font-mono font-bold text-warning">{energy}</span>
      </div>
    </div>
  )
}

/**
 * BADGE: Fuel (esquina superior izquierda, debajo de energy)
 */
export function E1PlusFuelBadge({ fuel }: { fuel: number }) {
  return (
    <div className="absolute top-8 left-0 w-20 h-14 bg-gradient-to-br from-danger/30 via-transparent to-transparent rounded-br-xl flex items-start justify-start p-1.5">
      <div className="flex items-center gap-1">
        <Flame className="w-3 h-3 text-danger" />
        <span className="text-[9px] font-mono font-bold text-danger">{fuel}</span>
      </div>
    </div>
  )
}

/**
 * BADGE: Machines (esquina superior derecha)
 */
export function E1PlusMachinesBadge({ machinesRounded }: { machinesRounded: number }) {
  return (
    <div className="absolute top-0 right-0 w-24 h-20 bg-gradient-to-bl from-secondary/30 via-transparent to-transparent rounded-bl-2xl flex items-start justify-end p-2">
      <div className="flex flex-col items-end gap-1">
        <span className="text-[10px] font-mono font-bold text-secondary">{machinesRounded}</span>
        <span className="text-[7px] text-secondary/60">u</span>
      </div>
    </div>
  )
}

/**
 * COMPONENT: Machine con badge exact
 */
export function E1PlusMachineElement({ machinesExact }: { machinesExact: number }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {/* <MachinePlaceholder size="lg" /> */}
        <span className="absolute -bottom-2 -right-2 px-1.5 py-0.5 rounded-full bg-primary text-white text-[8px] font-mono font-bold">
          x{machinesExact.toFixed(1)}
        </span>
      </div>
    </div>
  )
}

/**
 * COMPONENT: Línea conectante con nombre del item
 */
export function E1PlusConnectionLine({ outputName }: { outputName: string }) {
  return (
    <div className="flex-1 flex items-center justify-center px-2 relative h-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-0.5 bg-gradient-to-r from-primary/60 via-primary/40 to-success/60" />
      </div>
      <p className="text-[9px] text-muted-foreground bg-gradient-to-br from-content1 to-content2 px-2 relative z-10 whitespace-nowrap">
        {outputName}
      </p>
    </div>
  )
}

/**
 * COMPONENT: Badge de output rate
 */
export function E1PlusOutputRateBadge({ outputRate }: { outputRate: number }) {
  return (
    <div className="flex items-center">
      <div className="px-2 py-1 rounded-lg bg-success/20 border border-success/30">
        <p className="text-[12px] font-mono font-bold text-success">{outputRate}</p>
      </div>
    </div>
  )
}

/**
 * COMPONENT: Item output
 */
export function E1PlusItemElement() {
  return <div className="flex flex-col items-center">{/* <ItemPlaceholder size="lg" /> */}</div>
}

/**
 * COMPONENT: Flow central (máquina → línea → outputRate → item)
 */
export function E1PlusFlowRow({ data }: { data: NodeData }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-5">
      <E1PlusMachineElement machinesExact={data.machinesExact} />
      <E1PlusConnectionLine outputName={data.outputName} />
      <E1PlusOutputRateBadge outputRate={data.outputRate} />
      <E1PlusItemElement />
    </div>
  )
}

/**
 * COMPONENT: Header title
 */
export function E1PlusHeader({ name }: { name: string }) {
  return <p className="text-sm font-bold text-foreground text-center mb-5">{name}</p>
}

/**
 * COMPONENT: Divider
 */
export function E1PlusDivider() {
  return <div className="border-t border-default/30"></div>
}

/**
 * COMPONENT: Badges de esquinas (contenedor)
 */
export function E1PlusCornerBadges({ data }: { data: NodeData }) {
  return (
    <>
      <E1PlusEnergyBadge energy={data.energy} />
      <E1PlusFuelBadge fuel={data.fuel} />
      <E1PlusMachinesBadge machinesRounded={data.machinesRounded} />
    </>
  )
}

/**
 * COMPONENT: Content area (todo lo que está dentro del padding)
 */
export function E1PlusContentArea({ data }: { data: NodeData }) {
  return (
    <div className="p-5">
      <E1PlusHeader name={data.name} />
      <E1PlusFlowRow data={data} />
      <E1PlusDivider />
    </div>
  )
}
