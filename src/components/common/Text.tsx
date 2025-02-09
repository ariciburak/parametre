import { Text as RNText, TextStyle, StyleSheet } from 'react-native'
import { colors, typography } from '../../theme'

type TextVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'body1' 
  | 'body2' 
  | 'caption'
  | 'button'

interface TextProps {
  children: React.ReactNode
  variant?: TextVariant
  color?: string
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify'
  style?: TextStyle
}

export const Text = ({ 
  children, 
  variant = 'body1',
  color,
  align,
  style,
  ...props 
}: TextProps) => {
  const textStyle = [
    styles.base,
    variant && styles[variant],
    color && { color },
    align && { textAlign: align },
    style,
  ]

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  )
}

const styles = StyleSheet.create({
  base: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.regular,
    color: colors.text.primary,
  },
  h1: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
  },
  h2: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
  },
  h3: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
  },
  body1: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.regular,
  },
  body2: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.regular,
  },
  caption: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.regular,
  },
  button: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
}) 