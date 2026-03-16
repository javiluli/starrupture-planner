import { Flex, Typography } from '@/shared/ui'
import { Link } from '@heroui/react'
import { sections } from '../constant'

export const Sidebar = () => (
  <aside className="sticky top-24 h-fit w-56 space-y-3">
    <Typography variant="h3" className="uppercase tracking-wide font-bold">
      Sections
    </Typography>
    <Flex direction="col" align="start" gap="xs">
      {sections.map((section) => (
        <Link key={section.id} href={`#${section.id}`} className="text-foreground/70 hover:text-foreground">
          {section.label}
        </Link>
      ))}
    </Flex>
  </aside>
)
