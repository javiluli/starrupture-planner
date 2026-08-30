import { cn, Image, Skeleton } from '@heroui/react'
import { useCallback, useState } from 'react'

export type IconKind = 'items' | 'buildings' | 'corporations'

type AssetImageProps = {
  id: string
  kind: IconKind
  width?: number
  alt?: string
  loading?: 'eager' | 'lazy'
  className?: string
}

type ImageLoadState = 'loading' | 'loaded' | 'error'

const getIconSource = (kind: IconKind, id: string) => `${import.meta.env.BASE_URL}assets/icons/${kind}/${id}.webp`

const AssetImageResource = ({ id, kind, width, alt, loading = 'lazy', className }: AssetImageProps) => {
  const [loadState, setLoadState] = useState<ImageLoadState>('loading')
  const isLoaded = loadState === 'loaded'

  const bindImageEvents = useCallback((image: HTMLImageElement | null) => {
    if (!image) return

    const handleLoad = () => setLoadState('loaded')
    const handleError = () => setLoadState('error')

    image.addEventListener('load', handleLoad)
    image.addEventListener('error', handleError)

    // Cached images may already be complete before the ref callback runs.
    if (image.complete && image.naturalWidth > 0) handleLoad()

    return () => {
      image.removeEventListener('load', handleLoad)
      image.removeEventListener('error', handleError)
    }
  }, [])

  return (
    <span
      aria-busy={loadState === 'loading'}
      data-load-state={loadState}
      className={cn('relative inline-flex shrink-0 overflow-hidden align-middle', className)}
      style={{ width, height: width }}
    >
      {loadState === 'loading' && (
        <Skeleton data-asset-placeholder aria-hidden className="absolute inset-0 h-full w-full rounded-md bg-content2" />
      )}

      {loadState === 'error' && (
        <span data-asset-fallback aria-hidden className="absolute inset-0 rounded-md bg-content2/60" />
      )}

      <Image
        ref={bindImageEvents}
        as="img"
        removeWrapper
        alt={alt ?? id.replaceAll('_', ' ')}
        src={getIconSource(kind, id)}
        width={width}
        height={width}
        loading={loading}
        decoding="async"
        className="h-full w-full rounded-none object-contain transition-opacity duration-200"
        style={{ opacity: isLoaded ? 1 : 0 }}
      />
    </span>
  )
}

/**
 * Renders a catalog icon with stable dimensions and a loading placeholder.
 * The resource key resets its visual state when the requested icon changes.
 */
export const AssetImage = (props: AssetImageProps) => {
  return <AssetImageResource key={`${props.kind}:${props.id}`} {...props} />
}
