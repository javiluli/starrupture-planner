import { Typography } from '@/shared/ui'

export const Section = ({ id, title, subtitle, children }: { id: string; title: string; subtitle?: string; children: React.ReactNode }) => (
  <section id={id} className="space-y-4 scroll-mt-24">
    <div>
      <Typography variant="h3">{title}</Typography>
      {subtitle ? (
        <Typography variant="small" tone="soft">
          {subtitle}
        </Typography>
      ) : null}
    </div>
    <div className="panel-muted px-2 py-4">
      <div className="space-y-4">{children}</div>
    </div>
  </section>
)
