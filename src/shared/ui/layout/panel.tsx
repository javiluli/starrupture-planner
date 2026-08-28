import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@heroui/react'

// type PanelVariant = 'default' | 'muted'

type PanelPadding = 'none' | 'sm' | 'md' | 'lg'

type PanelProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode
  variant?: PanelVariant
  padding?: PanelPadding
}

const paddingClasses: Record<PanelPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

const panelVariant = {
  default: 'rounded-2xl bg-content1',
  muted: 'rounded-2xl bg-content1/20',
} as const

type PanelVariant = keyof typeof panelVariant

export const Panel = ({ children, className, variant = 'default', padding = 'md', ...props }: PanelProps) => (
  <div className={cn(panelVariant[variant], paddingClasses[padding], className)} {...props}>
    {children}
  </div>
)
