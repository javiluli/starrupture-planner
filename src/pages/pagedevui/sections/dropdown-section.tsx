import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react'
import { Section } from '../components'

export const DropdownSection = () => (
  <Section id="dropdown" title="Dropdown" subtitle="Menu and selection">
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">Open menu</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Dropdown menu">
        <DropdownItem key="one">First</DropdownItem>
        <DropdownItem key="two">Second</DropdownItem>
        <DropdownItem key="three">Third</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </Section>
)
