import { Flex, PageContainer, Panel, Typography } from '@/shared/ui'
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
  NumberinputPlayground,
  SelectsPlayground,
  TablePlayground,
  TabsPlayground,
  TooltipPlayground,
  TypographyPlayground,
} from './playground'
import { Theme } from './playground/custom/theme'

const PageDevUI = () => {
  return (
    <PageContainer className="gap-8">
      <div className="mx-auto w-full max-w-6xl space-y-2">
        <Panel className="p-4">
          <Flex direction="col" gap="sm">
            <Typography variant="h2">UI Playground</Typography>
            <Typography tone="soft">Dev-only page to preview typography, components, and theme cohesion.</Typography>
          </Flex>
        </Panel>

        <div className="grid grid-cols-[14rem_minmax(0,1fr)] gap-10 items-start py-4 pb-12">
          <Sidebar />
          <div className="space-y-10">
            <Theme />
            <TypographyPlayground />
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
            <NumberinputPlayground />
            <SelectsPlayground />
            <TablePlayground />
            <TabsPlayground />
            <TooltipPlayground />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default PageDevUI
