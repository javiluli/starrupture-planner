import type { CorporationsById } from '@/shared/@types/corporations.type'

export interface CorporationLevelRequirement {
  corporationId: string
  corporationName: string
  level: number
  xpRequired: number
  pointsPerItem: number
  pointsPerMinute: number
  timeMinutes: number
  totalItemsNeeded: number
}

/**
 * Calcula el tiempo estimado (en minutos) para completar un nivel de corporacion.
 * @param itemId - ID del objeto (ej. 'glass')
 * @param targetIpm - Produccion total por minuto (ej. 30)
 * @param corporations - Objeto JSON con los datos de las corporaciones
 */
export const calculateCorporationLevelRequirements = (
  itemId: string,
  targetIpm: number,
  corporations: CorporationsById,
): CorporationLevelRequirement[] => {
  const results: CorporationLevelRequirement[] = []

  // Recorremos el diccionario (Key: Nombre de la Corp, Value: Corporation)
  for (const [corpName, corpData] of Object.entries(corporations)) {
    // Buscamos si el item est� en alguno de los niveles de esta corporaci�n
    for (const level of corpData.levels) {
      const component = level.components.find((c) => c.id === itemId)

      if (component && level.xp > 0) {
        // Puntos generados por minuto: (Items producidos/min) * (Puntos por cada item)
        const ipmPoints = targetIpm * component.points

        // Tiempo: XP total del nivel / Puntos por minuto
        const minutes = ipmPoints > 0 ? level.xp / ipmPoints : 0

        // Items totales = XP necesaria / puntos por unidad
        const totalItems = level.xp / component.points

        results.push({
          corporationId: corpData.id,
          corporationName: corpName,
          level: level.level,
          xpRequired: level.xp,
          pointsPerItem: component.points,
          pointsPerMinute: ipmPoints,
          timeMinutes: minutes,
          totalItemsNeeded: Math.ceil(totalItems),
        })
      }
    }
  }

  return results
}
