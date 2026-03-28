import type { Building } from '@/shared/@types/building.type'

export const buildingHasRecipes = (building: Building) => (building.recipes?.length ?? 0) > 0
