import { Flex, Typography } from '@/shared/ui'
import { Button, Modal, ModalBody, ModalContent, ModalHeader, Popover, PopoverContent, PopoverTrigger, useDisclosure } from '@heroui/react'
import { Section } from '../components'

export const OverlaysSection = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <Section id="overlays" title="Modal & Popover" subtitle="Overlay components">
      <Flex wrap="wrap">
        <Button onPress={onOpen}>Open modal</Button>
        <Popover placement="bottom" showArrow>
          <PopoverTrigger>
            <Button variant="bordered">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent>
            <Typography variant="small">Popover content</Typography>
          </PopoverContent>
        </Popover>
      </Flex>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <Typography variant="h4">Example modal</Typography>
              </ModalHeader>
              <ModalBody>
                <Typography tone="muted">Modal body content to preview overlay styles.</Typography>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </Section>
  )
}
