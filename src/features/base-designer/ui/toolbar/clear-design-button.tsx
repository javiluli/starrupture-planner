import { useState } from 'react'
import { Flex, Typography } from '@/shared/ui'
import { Button, Popover, PopoverContent, PopoverTrigger } from '@heroui/react'
import { Trash2 } from 'lucide-react'

interface ClearDesignButtonProps {
  isDisabled: boolean
  onClear: () => void
}

export const ClearDesignButton = ({ isDisabled, onClear }: ClearDesignButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const confirmClear = () => {
    onClear()
    setIsOpen(false)
  }

  return (
    <Popover placement="bottom-end" isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          color="danger"
          aria-label="Clear design"
          title="Clear design"
          isDisabled={isDisabled}
        >
          <Trash2 aria-hidden className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3">
        <Flex direction="col" align="stretch" gap="md">
          <Flex direction="col" align="start" gap="xs">
            <Typography variant="h4">Clear design?</Typography>
            <Typography variant="small" tone="soft">
              You can undo this action afterwards.
            </Typography>
          </Flex>
          <Flex justify="end">
            <Button size="sm" variant="light" onPress={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" color="danger" onPress={confirmClear}>
              Clear
            </Button>
          </Flex>
        </Flex>
      </PopoverContent>
    </Popover>
  )
}
