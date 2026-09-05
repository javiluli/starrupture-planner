export interface Reward {
  name: string
}

export interface Component {
  id: string
  points: number
}

export interface Level {
  level: number
  xp: number
  components: readonly Component[]
  rewards: readonly Reward[]
}

export interface Corporation {
  id: string
  description: string
  levels: readonly Level[]
}

/**
 * Mapa global con todas las corporations del juego.
 * La clave es el nombre visible de la corporation, tal como aparece en el JSON.
 */
export type CorporationsByName = Readonly<Record<string, Corporation>>

/**
 * Referencia compacta a una corporation y su nivel.
 * Se usa en tablas y filtros para saber en que nivel aparece un item.
 */
export interface CorporationLevelRef {
  corporationId: string
  corporationName: string
  level: number
}
