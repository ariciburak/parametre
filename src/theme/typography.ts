export const typography = {
  // Font ailesi
  fontFamily: {
    regular: 'System',  // iOS ve Android'in sistem fontları
    medium: 'System',
    bold: 'System',
  },

  // Font boyutları
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  // Font ağırlıkları
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Satır yükseklikleri
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Hazır stil kombinasyonları
  variant: {
    h1: {
      fontSize: 30,
      fontWeight: '700' as const,
      lineHeight: 1.25,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 1.25,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 1.25,
    },
    body1: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 1.5,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 1.25,
    },
  },
}
