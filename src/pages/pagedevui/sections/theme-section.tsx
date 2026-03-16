import { Flex } from '@/shared/ui'
import { Section, ThemeSwatch } from '../components'

export const ThemeSection = () => (
  <Section id="theme" title="Theme tokens" subtitle="Core surfaces and borders">
    <Flex wrap="wrap" gap="md">
      <ThemeSwatch label="background" className="bg-background" />
      <ThemeSwatch label="content1" className="bg-content1" />
      <ThemeSwatch label="content2" className="bg-content2" />
      <ThemeSwatch label="content3" className="bg-content3" />
      <ThemeSwatch label="content4" className="bg-content4" />
      <ThemeSwatch label="divider" className="bg-divider/60" />
    </Flex>
  </Section>
)
