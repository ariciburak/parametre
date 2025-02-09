import React from 'react'
import { Text as RNText, TextProps, TextStyle } from 'react-native'

interface Props extends TextProps {
  style?: TextStyle | TextStyle[]
}

export const Text = ({ style, ...props }: Props) => {
  return (
    <RNText
      style={style}
      {...props}
    />
  )
} 