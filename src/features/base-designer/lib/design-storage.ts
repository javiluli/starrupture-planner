import type { StateStorage } from 'zustand/middleware'

/**
 * Coalesces frequent React Flow updates before touching localStorage.
 * Equal serialized designs are ignored and the latest pending value is flushed on page exit.
 */
export const createBaseDesignerStateStorage = (): StateStorage => {
  const delay = import.meta.env.MODE === 'test' ? 0 : 150
  const storedValues = new Map<string, string | null>()
  let pendingWrite: { name: string; value: string } | undefined
  let timer: ReturnType<typeof setTimeout> | undefined

  const flush = () => {
    if (!pendingWrite) return
    localStorage.setItem(pendingWrite.name, pendingWrite.value)
    storedValues.set(pendingWrite.name, pendingWrite.value)
    pendingWrite = undefined
    if (timer) clearTimeout(timer)
    timer = undefined
  }

  if (typeof window !== 'undefined') window.addEventListener('pagehide', flush)

  return {
    getItem: (name) => {
      const value = localStorage.getItem(name)
      storedValues.set(name, value)
      return value
    },
    setItem: (name, value) => {
      if (pendingWrite?.name === name && pendingWrite.value === value) return
      if (!pendingWrite && storedValues.get(name) === value) return

      pendingWrite = { name, value }
      if (delay === 0) {
        flush()
        return
      }

      if (timer) clearTimeout(timer)
      timer = setTimeout(flush, delay)
    },
    removeItem: (name) => {
      if (pendingWrite?.name === name) pendingWrite = undefined
      if (timer) clearTimeout(timer)
      timer = undefined
      storedValues.delete(name)
      localStorage.removeItem(name)
    },
  }
}
