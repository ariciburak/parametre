import React from 'react'
import { TextInput } from 'react-native'
import { colors } from '../../../theme'
import type { TransactionType } from '../../../constants/transactions'
import { styles } from './AmountInput.styles'

type Props = {
  value: string
  type: TransactionType
  onChange: (value: string) => void
}

export const AmountInput = ({ value, type, onChange }: Props) => {
  const color = type === 'income' ? colors.secondary.main : colors.error.main

  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChange}
      placeholder="0.00"
      placeholderTextColor={colors.text.secondary}
      keyboardType="decimal-pad"
      maxLength={10}
    />
  )
} 