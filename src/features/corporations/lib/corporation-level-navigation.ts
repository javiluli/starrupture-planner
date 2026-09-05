import { ROUTE } from '@/router/routes'

/** Builds the stable DOM id used to target a corporation level from another page. */
export const getCorporationLevelAnchorId = (corporationId: string, level: number) => {
  return `corporation-${corporationId}-level-${level}`
}

/** Builds a shareable route that opens a corporation and centers one of its levels. */
export const getCorporationLevelPath = (corporationId: string, level: number) => {
  const anchor = getCorporationLevelAnchorId(corporationId, level)
  return `${ROUTE.CORPORATIONS}?corporation=${encodeURIComponent(corporationId)}&level=${level}#${anchor}`
}
