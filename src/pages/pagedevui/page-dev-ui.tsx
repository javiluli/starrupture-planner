import { Flex, PageContainer, PageContent, PageHeader, Typography } from '@/shared/ui'
import { Sidebar } from './components'
import {
  AccordionPlayground,
  AutocompletePlayground,
  ButtonPlayground,
  CardsPlayground,
  CheckboxPlayground,
  ChipPlayground,
  DropdownPlayground,
  InputPlayground,
  LinkPlayground,
  ModalPlayground,
  NumberInputPlayground,
  SelectsPlayground,
  TablePlayground,
  TabsPlayground,
  TooltipPlayground,
  TypographyPlayground,
} from './playground'
import { LayoutPlayground, Theme, TreeListPlayground } from './playground/custom'

const PageDevUI = () => {
  return (
    <PageContainer className="mx-auto max-w-6xl">
      <PageHeader>
        <Flex direction="col" align="start" gap="sm">
          <Typography variant="h2">UI Playground</Typography>
          <Typography tone="soft">Dev-only page to preview typography, components, and theme cohesion.</Typography>
        </Flex>
      </PageHeader>

      <PageContent>
        <div className="grid grid-cols-1 items-start gap-6 pb-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10">
          <Sidebar />
          <div className="space-y-10">
            <Theme />
            <TypographyPlayground />
            <LayoutPlayground />
            <TreeListPlayground />
            <AccordionPlayground />
            <AutocompletePlayground />
            <ButtonPlayground />
            <CardsPlayground />
            <CheckboxPlayground />
            <ChipPlayground />
            <DropdownPlayground />
            <InputPlayground />
            <LinkPlayground />
            <ModalPlayground />
            <NumberInputPlayground />
            <SelectsPlayground />
            <TablePlayground />
            <TabsPlayground />
            <TooltipPlayground />
          </div>
        </div>
      </PageContent>
    </PageContainer>
  )
}

export default PageDevUI
