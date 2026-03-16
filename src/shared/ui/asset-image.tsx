import { Image } from '@heroui/react'

type IconKind = 'items' | 'buildings' | 'corporations'

type AssetImageProps = {
  id: string
  kind: IconKind
  className?: string
}

const iconMaps: Record<IconKind, Record<string, string>> = {
  items: import.meta.glob('../../assets/icons/items/*.png', {
    eager: true,
    import: 'default',
  }) as Record<string, string>,
  buildings: import.meta.glob('../../assets/icons/buildings/*.png', {
    eager: true,
    import: 'default',
  }) as Record<string, string>,
  corporations: import.meta.glob('../../assets/icons/corporations/*.png', {
    eager: true,
    import: 'default',
  }) as Record<string, string>,
}

const resolveIcon = (kind: IconKind, id: string) => {
  const path = `../../assets/icons/${kind}/${id}.png`
  return iconMaps[kind][path] ?? ''
}

export const AssetImage = ({ id, kind, className }: AssetImageProps) => (
  <Image alt={`${kind}__${id}`} src={resolveIcon(kind, id)} className={className} />
)
