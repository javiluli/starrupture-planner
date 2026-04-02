import type { CorporationsById } from '@/shared/@types/corporations.type'

/**
 * Determina si el item seleccionado lo requiere alguna corporation como suministro de entrega.
 *
 * @param corporations Catalogo de corporations.
 * @param itemId Id del item a comprobar.
 * @returns True si el item aparece en requisitos de niveles.
 */
export const isItemExportableToCorporation = (corporations: CorporationsById, itemId: string) =>
  Object.values(corporations).some((corp) => corp.levels.some((level) => level.components.some((comp) => comp.id === itemId)))
