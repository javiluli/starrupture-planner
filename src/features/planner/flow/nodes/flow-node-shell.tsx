import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@heroui/react'
import { Flex } from '@/shared/ui'

interface FlowNodeShellProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode
  selected?: boolean
}

/** Shared surface for every card rendered inside the production flow. */
export function FlowNodeShell({ children, selected = false, className, ...props }: FlowNodeShellProps) {
  return (
    <Flex
      direction="col"
      className={cn(
        'relative w-64 space-y-1 rounded-2xl border-4 bg-content1/90 px-4 py-3 text-foreground shadow-xl transition-[border-color,box-shadow]',
        selected ? 'border-primary shadow-background' : 'border-content3 shadow-none',
        className,
      )}
      {...props}
    >
      {children}
    </Flex>
  )
}
