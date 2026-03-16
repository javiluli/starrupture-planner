import { Flex } from '@/shared/ui'
import { Image, Link } from '@heroui/react'
import { Section } from '../components'

export const MediaSection = () => (
  <Section id="media" title="Images & Links" subtitle="Image and link primitives">
    <Flex wrap="wrap" align="center">
      <Image alt="Preview" src="https://placehold.co/72x72/png" width={72} height={72} className="rounded-xl" />
      <Link href="https://www.heroui.com/" isExternal>
        HeroUI docs
      </Link>
      <Link href="#" className="text-foreground/70 hover:text-foreground">
        Inline link
      </Link>
    </Flex>
  </Section>
)
