import { cn } from '@heroui/react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type PageContentOverflow = 'auto' | 'hidden' | 'visible'

export type PageContentProps = {
  children?: ReactNode
  overflow?: PageContentOverflow
} & Omit<ComponentPropsWithoutRef<'section'>, 'children'>

const overflowClasses: Record<PageContentOverflow, string> = {
  auto: 'overflow-y-auto overflow-x-hidden',
  hidden: 'overflow-hidden',
  visible: 'overflow-visible',
}

/** Owns the remaining page space and provides a single, predictable scroll boundary. */
export const PageContent = ({ children, className, overflow = 'auto', ...props }: PageContentProps) => (
  <section className={cn('min-h-0 min-w-0 flex-1', overflowClasses[overflow], className)} {...props}>
    {children}
  </section>
)
