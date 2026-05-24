import { Typography } from '@/shared/ui'

interface Props {
  id: string
  title: string
  children: React.ReactNode
}

export const ComponentPlayground = ({ id, title, children }: Props) => (
  <section id={id} className="px-6 py-8 border border-default rounded-2xl space-y-4">
    <Typography variant="h3">{title}</Typography>
    <div className="space-y-6">{children}</div>
  </section>
)
