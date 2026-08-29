import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

import { cn } from '@heroui/react'

export type PanelPadding = 'none' | 'sm' | 'md' | 'lg'

export type PanelProps<T extends ElementType = 'div'> = {
  as?: T
  children?: ReactNode
  variant?: PanelVariant
  padding?: PanelPadding
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

const paddingClasses: Record<PanelPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

const panelVariant = {
  default: 'rounded-2xl border border-divider/70 bg-content1',
  muted: 'rounded-2xl border border-divider/70 bg-content1/20',
} as const

export type PanelVariant = keyof typeof panelVariant

export const Panel = <T extends ElementType = 'div'>({
  as,
  children,
  className,
  variant = 'default',
  padding = 'md',
  ...props
}: PanelProps<T>) => {
  const Component = as ?? 'div'

  return (
    <Component className={cn(panelVariant[variant], paddingClasses[padding], className)} {...props}>
      {children}
    </Component>
  )
}
