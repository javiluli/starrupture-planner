import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@heroui/react'

type PageContainerProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode
}

export const PageContainer = ({ children, className, ...props }: PageContainerProps) => (
  <div className={cn('h-full flex flex-col px-6 py-4 space-y-4', className)} {...props}>
    {children}
  </div>
)
