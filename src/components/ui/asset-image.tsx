import { Image } from '@heroui/react'

export const ItemImage = ({ id, className }: { id: string; className?: string }) => (
  <Image alt={`item__${id}`} src={`/assets/icons/items/${id}.png`} className={className} />
)

export const BuildingImage = ({ id, className }: { id: string; className?: string }) => (
  <Image alt={`building__${id}`} src={`/assets/icons/buildings/${id}.png`} className={className} />
)

export const CorporationImage = ({ id, className }: { id: string; className?: string }) => (
  <Image alt={`corporation__${id}`} src={`/assets/icons/corporations/${id}.png`} className={className} />
)
