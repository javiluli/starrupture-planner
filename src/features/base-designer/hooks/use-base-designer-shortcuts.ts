import { useEffect } from 'react'
import { baseDesignerSelectors, useBaseDesignerStore } from '@/store/base-designer.store'

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

/** Registra atajos del editor sin interceptar campos de texto ni controles editables. */
export const useBaseDesignerShortcuts = () => {
  const undo = useBaseDesignerStore(baseDesignerSelectors.undo)
  const redo = useBaseDesignerStore(baseDesignerSelectors.redo)
  const selectAllBuildings = useBaseDesignerStore(baseDesignerSelectors.selectAllBuildings)
  const clearSelection = useBaseDesignerStore(baseDesignerSelectors.clearSelection)
  const deleteSelection = useBaseDesignerStore(baseDesignerSelectors.deleteSelection)
  const duplicateSelectedBuildings = useBaseDesignerStore(baseDesignerSelectors.duplicateSelectedBuildings)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return

      if (event.key === 'Escape') {
        clearSelection()
        return
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault()
        deleteSelection()
        return
      }

      const usesCommandKey = event.ctrlKey || event.metaKey
      if (!usesCommandKey) return

      if (event.key.toLowerCase() === 'a') {
        event.preventDefault()
        selectAllBuildings()
        return
      }

      if (event.key.toLowerCase() === 'z') {
        event.preventDefault()
        if (event.shiftKey) redo()
        else undo()
        return
      }

      if (event.key.toLowerCase() === 'y') {
        event.preventDefault()
        redo()
        return
      }

      if (event.key.toLowerCase() === 'd') {
        event.preventDefault()
        duplicateSelectedBuildings()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [clearSelection, deleteSelection, duplicateSelectedBuildings, redo, selectAllBuildings, undo])
}
