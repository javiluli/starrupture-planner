import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@heroui/react'

type PageContainerProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode
}

export const PageContainer = ({ children, className, ...props }: PageContainerProps) => (
  <div
    className={cn('flex h-full min-h-0 w-full flex-col gap-4 overflow-hidden px-3 py-3 sm:px-4 sm:py-4 lg:px-6', className)}
    {...props}
  >
    {children}
  </div>
)
