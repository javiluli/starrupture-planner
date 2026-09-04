import { Flex } from '@/shared/ui'
import { baseDesignerSelectors, useBaseDesignerStore } from '@/store/base-designer.store'
import { Button, Chip, Divider, Tooltip } from '@heroui/react'
import { Panel as FlowPanel } from '@xyflow/react'
import { CircleX, CopyPlus, MousePointer2, Redo2, Undo2 } from 'lucide-react'
import { useBaseDesignerShortcuts } from '../../hooks/use-base-designer-shortcuts'
import { ClearDesignButton } from './clear-design-button'

interface ToolbarButtonProps {
  label: string
  shortcut: string
  isDisabled: boolean
  onPress: () => void
  icon: typeof Undo2
}

const ToolbarButton = ({ label, shortcut, isDisabled, onPress, icon: Icon }: ToolbarButtonProps) => (
  <Tooltip content={`${label} (${shortcut})`} delay={250}>
    <span>
      <Button isIconOnly size="sm" variant="light" aria-label={label} isDisabled={isDisabled} onPress={onPress}>
        <Icon aria-hidden className="size-4" />
      </Button>
    </span>
  </Tooltip>
)

export const BaseDesignerToolbar = () => {
  const canUndo = useBaseDesignerStore(baseDesignerSelectors.canUndo)
  const canRedo = useBaseDesignerStore(baseDesignerSelectors.canRedo)
  const hasBuildings = useBaseDesignerStore(baseDesignerSelectors.hasBuildings)
  const selectedBuildingCount = useBaseDesignerStore(baseDesignerSelectors.selectedBuildingCount)
  const selectedEdgeCount = useBaseDesignerStore(baseDesignerSelectors.selectedEdgeCount)
  const undo = useBaseDesignerStore(baseDesignerSelectors.undo)
  const redo = useBaseDesignerStore(baseDesignerSelectors.redo)
  const clearDesign = useBaseDesignerStore(baseDesignerSelectors.clearDesign)
  const selectAllBuildings = useBaseDesignerStore(baseDesignerSelectors.selectAllBuildings)
  const clearSelection = useBaseDesignerStore(baseDesignerSelectors.clearSelection)
  const deleteSelection = useBaseDesignerStore(baseDesignerSelectors.deleteSelection)
  const duplicateSelectedBuildings = useBaseDesignerStore(baseDesignerSelectors.duplicateSelectedBuildings)
  const selectedCount = selectedBuildingCount + selectedEdgeCount
  const hasSelection = selectedCount > 0

  useBaseDesignerShortcuts()

  return (
    <FlowPanel position="top-right" className="m-3">
      <Flex className="rounded-xl border border-divider/70 bg-content1/90 p-1 shadow-md backdrop-blur">
        <ToolbarButton label="Undo" shortcut="Ctrl+Z" isDisabled={!canUndo} onPress={undo} icon={Undo2} />
        <ToolbarButton label="Redo" shortcut="Ctrl+Shift+Z" isDisabled={!canRedo} onPress={redo} icon={Redo2} />

        <Divider orientation="vertical" className="mx-1 h-6" />

        <ToolbarButton
          label="Select all buildings"
          shortcut="Ctrl+A"
          isDisabled={!hasBuildings}
          onPress={selectAllBuildings}
          icon={MousePointer2}
        />

        {hasSelection && (
          <>
            <Chip size="sm" variant="flat" color="primary" onClose={clearSelection} aria-label={`${selectedCount} elements selected`}>
              {selectedCount} selected
            </Chip>
            <ToolbarButton
              label="Duplicate selected buildings"
              shortcut="Ctrl+D"
              isDisabled={selectedBuildingCount === 0}
              onPress={duplicateSelectedBuildings}
              icon={CopyPlus}
            />
            <ToolbarButton label="Delete selection" shortcut="Delete" isDisabled={!hasSelection} onPress={deleteSelection} icon={CircleX} />
          </>
        )}

        <Divider orientation="vertical" className="mx-1 h-6" />
        <ClearDesignButton isDisabled={!hasBuildings} onClear={clearDesign} />
      </Flex>
    </FlowPanel>
  )
}
