import type { BuildingConstructionArea, RawBuilding } from '@/shared/@types/building.type'
import type { Corporation, CorporationsByName } from '@/shared/@types/corporations.type'
import type { RawItem } from '@/shared/@types/item.type'
import buildingsCatalog from './buildings_and_recipes.json'
import constructionAreasCatalog from './buildings_construction_area.json'
import corporationsCatalog from './corporations_components.json'
import itemsCatalog from './items_catalog.json'
import { indexProducerBuildingsByItemId, isProductionBuilding } from './building-production'
import { createCatalogIndex, createCorporationReferencesByItemId, createItemNameIndex } from './catalog-indexes'
import { normalizeBuildings, normalizeItems } from './catalog-normalization'

/** Buildings con la forma original del JSON; aquí los campos ausentes siguen siendo opcionales. */
const rawBuildings: readonly RawBuilding[] = buildingsCatalog

/** Items con la forma original del JSON, antes de enriquecerlos para la aplicación. */
const rawItems: readonly RawItem[] = itemsCatalog

/** Medidas de construcción originales utilizadas por Base Designer. */
const constructionAreas: readonly BuildingConstructionArea[] = constructionAreasCatalog

/** Corporations indexadas por el nombre visible del JSON, no por su ID interno. */
export const corporationsByName: CorporationsByName = corporationsCatalog

/** Buildings normalizados para que power, heat y recipes siempre estén disponibles. */
export const buildings = normalizeBuildings(rawBuildings)

/** Corporations como array ordenado para listados y selectores. */
export const corporationsList: readonly Corporation[] = Object.values(corporationsByName)

/** Asociaciones de corporation y nivel agrupadas por el ID del item aceptado. */
export const corporationsByItemId = createCorporationReferencesByItemId(corporationsByName)

/** Items enriquecidos con un tipo soportado y sus asociaciones de corporations. */
export const items = normalizeItems(rawItems, corporationsByItemId)

/** Permite encontrar un item normalizado sin recorrer el catálogo completo. */
export const itemById = createCatalogIndex(items)

/** Permite encontrar un building normalizado sin recorrer el catálogo completo. */
export const buildingById = createCatalogIndex(buildings)

/** Permite encontrar una corporation mediante su ID interno. */
export const corporationById = createCatalogIndex(corporationsList)

/** Permite encontrar las medidas de Base Designer mediante el ID del building. */
export const constructionAreaByBuildingId = createCatalogIndex(constructionAreas)

/** Permite obtener solo el nombre visible de un item cuando no hace falta su registro completo. */
export const itemNameById = createItemNameIndex(items)

/** Conserva todos los productores de un item respetando el orden del catálogo. */
export const producerBuildingsByItemId = indexProducerBuildingsByItemId(buildings)

/** Buildings que pueden aparecer en filtros y variantes de producción. */
export const productionBuildings = buildings.filter(isProductionBuilding)

// Expone las reglas de producción reutilizables desde la frontera pública de datos.
export { indexProducerBuildingsByItemId, isProductionBuilding } from './building-production'
