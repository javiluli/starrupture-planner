import type { CorporationsData } from '@/shared/@types/production'

/**
 * Determina si el item seleccionado lo requiere alguna corporation como suministro de entrega.
 *
 * @param corporations Catalogo de corporations.
 * @param itemId Id del item a comprobar.
 * @returns True si el item aparece en requisitos de niveles.
 */
export const isItemExportableToCorporation = (corporations: CorporationsData, itemId: string) =>
  Object.values(corporations).some((corp) => corp.levels.some((level) => level.components.some((comp) => comp.id === itemId)))
