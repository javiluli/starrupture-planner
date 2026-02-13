/**
 * Convierte un color hex (#RRGGBB) + porcentaje de opacity a hex con alpha (#RRGGBBAA)
 * @param hex Color en formato #RRGGBB
 * @param opacity Porcentaje de opacidad 0-100
 * @returns Color con alpha en hex (#RRGGBBAA)
 */
export function colorWithOpacity(hex: string, opacity: number) {
  // Limpiar %
  const clampedOpacity = Math.min(Math.max(opacity, 0), 100)

  // Convertir a valor hex 00-FF
  const alpha = Math.round((clampedOpacity / 100) * 255)
    .toString(16)
    .padStart(2, '0')

  // Devolver color final
  return `${hex}${alpha}`
}
