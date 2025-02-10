import React from 'react'
import { TextInput, TextStyle } from 'react-native'
import { colors } from '../../../theme'
import type { TransactionType } from '../../../constants/transactions'

type Props = {
  value: string
  type: TransactionType
  onChange: (value: string) => void
}

export const AmountInput = ({ value, type, onChange }: Props) => {
  const color = type === 'income' ? colors.secondary.main : colors.error.main

  const inputStyle: TextStyle = {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
    padding: 0,
    textAlign: 'right',
  }

  return (
    <TextInput
      style={inputStyle}
      value={value}
      onChangeText={onChange}
      placeholder="0.00"
      placeholderTextColor={colors.text.secondary}
      keyboardType="decimal-pad"
      maxLength={10}
    />
  )
} 