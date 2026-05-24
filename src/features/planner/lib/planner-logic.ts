export const clampTargetIpm = (value: number) => {
  if (Number.isNaN(value)) return 0
  return Math.max(0, value)
}
