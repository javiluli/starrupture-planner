import { calculateBaseDesignerStats } from '../lib/calculate-base-designer-stats'
import { buildings } from '@/shared/data'
import { baseDesignerSelectors, useBaseDesignerStore } from '@/store/base-designer.store'

/** Subscribes only to building membership, so moving nodes does not redraw the stats. */
export const useBaseDesignerStats = () => {
  const buildingIdsKey = useBaseDesignerStore(baseDesignerSelectors.buildingIdsKey)
  const buildingIds = buildingIdsKey ? buildingIdsKey.split('|') : []

  return calculateBaseDesignerStats(buildingIds, buildings)
}
