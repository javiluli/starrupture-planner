import type { Item } from '@/shared/@types/production'

/**
 * Busca un item por id en el catalogo.
 *
 * @param items Catalogo de items.
 * @param itemId Id del item.
 * @returns Item encontrado o undefined.
 */
export const findItemById = (items: Item[], itemId: string) => items.find((item) => item.id === itemId)

/**
 * Devuelve el nombre visible del item.
 *
 * @param items Catalogo de items.
 * @param itemId Id del item.
 * @returns Nombre traducido o el id como fallback.
 */
export const getItemName = (items: Item[], itemId: string) => findItemById(items, itemId)?.name || itemId

/**
 * Devuelve el tipo del item.
 *
 * @param items Catalogo de items.
 * @param itemId Id del item.
 * @returns Tipo de item o 'raw' por defecto.
 */
export const getItemType = (items: Item[], itemId: string) => findItemById(items, itemId)?.type || 'raw'

/**
 * Normaliza stats del edificio para evitar undefined.
 *
 * @param building Edificio opcional.
 * @returns Stats con defaults en 0.
 */
export const getBuildingStats = (building?: { power?: number; heat?: number }) => ({
  power: building?.power || 0,
  heat: building?.heat || 0,
})
