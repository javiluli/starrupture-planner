import type { CorporationsByName, CorporationLevelRef } from '@/shared/@types/corporations.type'
import type { Item } from '@/shared/@types/item.type'

/** Crea un índice estable por ID sin modificar el array de origen. */
export const createCatalogIndex = <T extends { id: string }>(values: readonly T[]): ReadonlyMap<string, T> =>
  new Map(values.map((value): [string, T] => [value.id, value]))

/** Crea el índice ligero usado cuando una vista solo necesita el nombre de un item. */
export const createItemNameIndex = (items: readonly Item[]): ReadonlyMap<string, string> =>
  new Map(items.map((item) => [item.id, item.name]))

/** Agrupa cada requisito de nivel de corporation por el item que acepta. */
export const createCorporationReferencesByItemId = (
  corporationsByName: CorporationsByName,
): ReadonlyMap<string, readonly CorporationLevelRef[]> => {
  const referencesByItemId = new Map<string, CorporationLevelRef[]>()

  // Recorre una sola vez los tres niveles de origen: corporation, nivel y componente.
  for (const [corporationName, corporation] of Object.entries(corporationsByName)) {
    for (const level of corporation.levels) {
      for (const component of level.components) {
        const references = referencesByItemId.get(component.id) ?? []

        references.push({ corporationId: corporation.id, corporationName, level: level.level })
        referencesByItemId.set(component.id, references)
      }
    }
  }

  return referencesByItemId
}
