import { constructionAreaByBuildingId } from '@/shared/data'
import { BASE_DESIGNER_FALLBACK_FOOTPRINT, BASE_DESIGNER_GRID_SIZE } from '../base-designer.config'
import type { BuildingFootprint } from '../types'

export interface BuildingFootprintInfo {
  footprint: BuildingFootprint
  isEstimated: boolean
}

/** Returns the catalogued footprint or the explicit estimated fallback. */
export const getBuildingFootprintInfo = (buildingId: string): BuildingFootprintInfo => {
  const sourceFootprint = constructionAreaByBuildingId.get(buildingId)?.area_ocupada

  if (!sourceFootprint) {
    return { footprint: BASE_DESIGNER_FALLBACK_FOOTPRINT, isEstimated: true }
  }

  return {
    footprint: { columns: sourceFootprint[0], rows: sourceFootprint[1] },
    isEstimated: false,
  }
}

/** Returns the dimensions used by placement and collision calculations. */
export const getBuildingFootprint = (buildingId: string) => getBuildingFootprintInfo(buildingId).footprint

export const footprintToPixels = ({ columns, rows }: BuildingFootprint) => ({
  width: columns * BASE_DESIGNER_GRID_SIZE,
  height: rows * BASE_DESIGNER_GRID_SIZE,
})

/** Uses the Base Core construction diameter as the controlled React Flow field size. */
export const getBaseFieldPixelSize = () => {
  const diameter = constructionAreaByBuildingId.get('base_core')?.diametro_area_construccion ?? 102
  return diameter * BASE_DESIGNER_GRID_SIZE
}
