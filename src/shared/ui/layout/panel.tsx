import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@heroui/react'

type PanelVariant = 'default' | 'muted'

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

export const Panel = ({ children, className, variant = 'default', padding = 'md', ...props }: PanelProps) => (
  <div
    className={cn(variant === 'muted' ? 'panel-muted' : 'panel', paddingClasses[padding], className)}
    {...props}
  >
    {children}
  </div>
)
