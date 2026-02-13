import { cn } from '@heroui/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import './styles.css'

export interface MarqueeProps {
  children: ReactNode
  animationDuration?: number
  reverse?: boolean
}

export function Marquee({ children, animationDuration = 200, reverse = false }: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [repetitions, setRepetitions] = useState(2)

  useEffect(() => {
    const calculateRepetitions = () => {
      if (containerRef.current && contentRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const contentWidth = contentRef.current.offsetWidth
        if (contentWidth > 0) {
          // Calculamos cuántos bloques caben + buffer para que no haya huecos
          const needed = Math.ceil(containerWidth / contentWidth) + 2
          setRepetitions(needed)
        }
      }
    }

    calculateRepetitions()
    window.addEventListener('resize', calculateRepetitions)
    return () => window.removeEventListener('resize', calculateRepetitions)
  }, [])

  return (
    <div ref={containerRef} className="relative flex w-full overflow-hidden bg-content1 py-4">
      <div className="bg-linear-to-r/srgb from-content1 from-5% via-transparent to-content1 to-95% pointer-events-none absolute inset-y-0 top-0 right-0 w-full h-full z-10" />

      <div
        className={cn('animate-marquee-pause flex w-max flex-nowrap', reverse ? 'animate-marquee-reverse' : 'animate-marquee')}
        style={
          {
            '--duration': `${animationDuration}s`,
            '--count': repetitions,
          } as React.CSSProperties
        }
      >
        {/* Renderizado dinámico */}
        {[...Array(repetitions)].map((_, i) => (
          <div key={i} ref={i === 0 ? contentRef : null} className="flex shrink-0 items-center gap-4 px-2">
            {children}
          </div>
        ))}
      </div>
    </div>
  )
}
