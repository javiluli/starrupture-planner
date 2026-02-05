import { createContext, useState, type Dispatch, type SetStateAction, type ReactNode } from 'react'
import { type XYPosition } from '@xyflow/react'

export type OnDropAction = ({ position }: { position: XYPosition }) => void

interface DnDContextType {
  isDragging: boolean
  setIsDragging: Dispatch<SetStateAction<boolean>>
  dropAction: OnDropAction | null
  setDropAction: Dispatch<SetStateAction<OnDropAction | null>>
}

const DnDContext = createContext<DnDContextType | null>(null)

export function DnDProvider({ children }: { children: ReactNode }) {
  const [isDragging, setIsDragging] = useState(false)
  const [dropAction, setDropAction] = useState<OnDropAction | null>(null)

  return (
    <DnDContext.Provider
      value={{
        isDragging,
        setIsDragging,
        dropAction,
        // Hack para evitar que React trate la función como un lazy initializer
        setDropAction: (action) => setDropAction(() => action),
      }}
    >
      {children}
    </DnDContext.Provider>
  )
}

export default DnDContext
