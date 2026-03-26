import type { Building } from '@/shared/@types/production'

export const buildingHasRecipes = (building: Building) => (building.recipes?.length ?? 0) > 0
