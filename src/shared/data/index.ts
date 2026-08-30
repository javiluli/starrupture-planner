import type { CorporationsById, CorporationLevelRef } from '@/shared/@types/corporations.type'
import type { Item } from '@/shared/@types/item.type'
import buildings from './buildings_and_recipes.json'
import corporationsCatalog from './corporations_components.json'
import itemsCatalog from './items_catalog.json'

const corporations = corporationsCatalog as CorporationsById
const corporationsByItemId = new Map<string, CorporationLevelRef[]>()

for (const [corporationName, corporation] of Object.entries(corporations)) {
  for (const level of corporation.levels) {
    for (const component of level.components) {
      const references = corporationsByItemId.get(component.id) ?? []
      references.push({ corporationId: corporation.id, corporationName, level: level.level })
      corporationsByItemId.set(component.id, references)
    }
  }
}

/** Game items enriched once with their corporation delivery requirements. */
const items = (itemsCatalog as Item[]).map((item) => ({
  ...item,
  corporations: corporationsByItemId.get(item.id) ?? [],
}))

export { items, buildings, corporations }

