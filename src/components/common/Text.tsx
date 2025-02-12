import React from 'react'
import { Text as RNText, TextProps, TextStyle } from 'react-native'
import { colors } from '../../theme/colors'

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'label' | 'caption'

interface Props extends TextProps {
  style?: TextStyle | TextStyle[]
  variant?: TextVariant
}

const getVariantStyle = (variant: TextVariant): TextStyle => {
  switch (variant) {
    case 'h1':
      return {
        fontSize: 32,
        fontWeight: '700',
      }
    case 'h2':
      return {
        fontSize: 24,
        fontWeight: '600',
      }
    case 'h3':
      return {
        fontSize: 20,
        fontWeight: '600',
      }
    case 'body':
      return {
        fontSize: 16,
        fontWeight: '400',
      }
    case 'label':
      return {
        fontSize: 14,
        fontWeight: '500',
      }
    case 'caption':
      return {
        fontSize: 12,
        fontWeight: '400',
      }
  }
}

export const Text = ({ style, variant = 'body', ...props }: Props) => {
  return (
    <RNText
      style={[
        { color: colors.text.primary },
        variant && getVariantStyle(variant),
        style,
      ]}
      {...props}
    />
  )
} 