import { type Selection } from '@heroui/react'

export const getSingleSelection = <T extends string>(selection: Selection, fallback: T): T => {
  const value = Array.from(selection)[0]
  return (value ?? fallback) as T
}
