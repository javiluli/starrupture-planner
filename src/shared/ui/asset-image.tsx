import { cn, Image } from '@heroui/react'

type IconKind = 'items' | 'buildings' | 'corporations'

type AssetImageProps = {
  id: string
  kind: IconKind
  width?: number
  className?: string
}

type IconMap = Record<string, string>

const buildIconMap = (modules: Record<string, string>) => {
  const map: IconMap = {}
  Object.entries(modules).forEach(([path, src]) => {
    const fileName = path.split('/').pop() ?? ''
    const id = fileName.replace(/\.webp$/i, '')
    if (!id) return
    map[id] = src
  })
  return map
}

const iconMaps: Record<IconKind, IconMap> = {
  items: buildIconMap(
    import.meta.glob('../../assets/icons/items/*.webp', {
      eager: true,
      import: 'default',
    }) as Record<string, string>,
  ),
  buildings: buildIconMap(
    import.meta.glob('../../assets/icons/buildings/*.webp', {
      eager: true,
      import: 'default',
    }) as Record<string, string>,
  ),
  corporations: buildIconMap(
    import.meta.glob('../../assets/icons/corporations/*.webp', {
      eager: true,
      import: 'default',
    }) as Record<string, string>,
  ),
}

const resolveIcon = (kind: IconKind, id: string) => iconMaps[kind][id] ?? ''

export const AssetImage = ({ id, kind, width, className }: AssetImageProps) => (
  <Image alt={`${kind}__${id}`} src={resolveIcon(kind, id)} width={width} className={cn('rounded-none', className)} />
)
