import { colors } from './colors'
import { typography } from './typography'
import { spacing } from './spacing'

export const theme = {
  colors,
  typography,
  spacing,
}

export type Theme = typeof theme

// Tema bileşenlerini ayrı ayrı da export ediyoruz
export { colors, typography, spacing }
