import { Flex, Typography } from '@/shared/ui'
import { Chip } from '@heroui/react'

interface Props {
  /** Nivel a completar */
  level: number
  /** Cantidad de experiencia necesaria para completar el nivel */
  xp: number
}

export const LevelAndXPRequired = ({ level, xp }: Props) => (
  <Flex gap="md">
    <Typography variant="h4">Level {level} </Typography>
    <Chip variant="bordered" color="primary">
      {xp} G
    </Chip>
  </Flex>
)
