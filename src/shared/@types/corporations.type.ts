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
  components: Component[]
  rewards: Reward[]
}

export interface Corporation {
  id: string
  description: string
  levels: Level[]
}

/**
 * Mapa global con todas las corporations del juego.
 * La clave es el id de la corporation.
 */
export interface CorporationsById {
  [corporationId: string]: Corporation
}

/**
 * Referencia compacta a una corporation y su nivel.
 * Se usa en tablas y filtros para saber en que nivel aparece un item.
 */
export interface CorporationLevelRef {
  corporationId: string
  level: number
}

/**
 * Alias legacy para no romper imports antiguos.
 * Usa CorporationsById en nuevos archivos.
 */
export type CorporationsData = CorporationsById

/**
 * Alias legacy para no romper imports antiguos.
 * Usa CorporationLevelRef en nuevos archivos.
 */
export type CorporationLevelMatch = CorporationLevelRef
