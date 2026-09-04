const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)

export const isPositiveSupplyCount = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 1

export const normalizeSupplyCountByItem = (value: unknown): Record<string, number> => {
  if (!isRecord(value)) return {}

  const normalized: Record<string, number> = {}

  Object.entries(value).forEach(([itemId, amount]) => {
    if (isPositiveSupplyCount(amount)) normalized[itemId] = amount
  })

  return normalized
}

export const getSupplyCountItemIds = (supplyCountByItem: Record<string, number>) =>
  Object.keys(normalizeSupplyCountByItem(supplyCountByItem))
