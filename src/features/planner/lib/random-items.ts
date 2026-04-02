import type { Item } from '@/shared/@types/item.type'
import { pickRandomItems } from '@/shared/utils'

/**
 * Devuelve ids aleatorios basados en el orden actual de items.
 *
 * Nota: no es estable, puede variar en cada render.
 *
 * @param items Lista completa de items.
 * @param count Cantidad de ids a devolver.
 * @returns Lista de ids aleatorios.
 */
export const getRandomItemIds = (items: Item[], count: number) => {
  const ids = items.map((i) => i.id)
  return pickRandomItems(ids, count)
}
