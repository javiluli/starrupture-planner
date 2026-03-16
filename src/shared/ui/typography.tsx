import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

import { cn } from '@heroui/react'

type TypographyVariant = 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small' | 'micro'

type TypographyTone = 'normal' | 'muted' | 'soft'

type TypographyProps<T extends ElementType = 'p'> = {
  as?: T
  variant?: TypographyVariant
  tone?: TypographyTone
  children?: ReactNode
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

const variantClasses: Record<TypographyVariant, string> = {
  display: 'text-[2.25rem] leading-tight font-semibold tracking-tight',
  h1: 'text-[1.875rem] leading-tight font-semibold tracking-tight',
  h2: 'text-[1.5rem] leading-snug font-semibold tracking-tight',
  h3: 'text-[1.25rem] leading-snug font-semibold',
  h4: 'text-[1rem] leading-snug font-semibold',
  body: 'text-[0.95rem] leading-relaxed font-normal',
  small: 'text-[0.85rem] leading-snug font-medium',
  micro: 'text-[0.75rem] leading-tight font-semibold',
}

const toneClasses: Record<TypographyTone, string> = {
  normal: 'text-foreground',
  muted: 'text-foreground/80',
  soft: 'text-foreground/60',
}

export const Typography = <T extends ElementType = 'p'>({
  as,
  variant = 'body',
  tone = 'normal',
  children,
  className,
  ...props
}: TypographyProps<T>) => {
  const Component = as ?? 'p'

  return (
    <Component className={cn(variantClasses[variant], toneClasses[tone], className)} {...props}>
      {children}
    </Component>
  )
}
