import type { Building, RawBuilding } from '@/shared/@types/building.type'
import type { CorporationLevelRef } from '@/shared/@types/corporations.type'
import type { Item, ItemType, RawItem } from '@/shared/@types/item.type'

/** Tipos de item que entienden actualmente los filtros, agrupaciones y cálculos. */
const ITEM_TYPES = new Set<string>(['raw', 'processed', 'component', 'material', 'ammo'])

/** Comprueba que un string externo sea un tipo de item soportado por la aplicación. */
const isItemType = (value: string): value is ItemType => ITEM_TYPES.has(value)

/** Normaliza campos numéricos y recetas opcionales sin modificar el snapshot de buildings. */
export const normalizeBuildings = (rawBuildings: readonly RawBuilding[]): readonly Building[] =>
  rawBuildings.map((building) => ({
    ...building,
    power: building.power ?? 0,
    heat: building.heat ?? 0,
    recipes: building.recipes ?? [],
  }))

/** Añade asociaciones de corporations y valida el tipo de cada item. */
export const normalizeItems = (
  rawItems: readonly RawItem[],
  corporationsByItemId: ReadonlyMap<string, readonly CorporationLevelRef[]>,
): readonly Item[] =>
  rawItems.map((item) => {
    // Un tipo nuevo requiere una decisión explícita de UI y dominio; no se oculta con un fallback.
    if (!isItemType(item.type)) throw new Error(`Unsupported item type "${item.type}" for ${item.id}`)

    return {
      ...item,
      type: item.type,
      corporations: corporationsByItemId.get(item.id) ?? [],
    }
  })
