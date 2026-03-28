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
