import { constructionAreaByBuildingId } from '@/shared/data'
import { BASE_DESIGNER_FALLBACK_FOOTPRINT, BASE_DESIGNER_GRID_SIZE } from '../base-designer.config'
import type { BuildingFootprint } from '../types'

/**
 * Returns the footprint declared by the game data.
 * Buildings not catalogued yet use the current in-game 4x4 fallback explicitly.
 */
export const getBuildingFootprint = (buildingId: string): BuildingFootprint => {
  const footprint = constructionAreaByBuildingId.get(buildingId)?.area_ocupada
  if (!footprint || !Number.isFinite(footprint[0]) || !Number.isFinite(footprint[1])) return BASE_DESIGNER_FALLBACK_FOOTPRINT

  return { columns: footprint[0], rows: footprint[1] }
}

export const footprintToPixels = ({ columns, rows }: BuildingFootprint) => ({
  width: columns * BASE_DESIGNER_GRID_SIZE,
  height: rows * BASE_DESIGNER_GRID_SIZE,
})

/** Uses the Base Core construction diameter as the controlled React Flow field size. */
export const getBaseFieldPixelSize = () => {
  const diameter = constructionAreaByBuildingId.get('base_core')?.diametro_area_construccion ?? 102
  return diameter * BASE_DESIGNER_GRID_SIZE
}
