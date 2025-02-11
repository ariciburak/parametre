import React from 'react'
import { View, TextInput, Text } from 'react-native'
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

  const formatValue = (val: string) => {
    // Remove non-numeric characters
    const numericValue = val.replace(/[^0-9]/g, '')
    
    // Add thousand separators
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const handleChange = (val: string) => {
    // Eğer backspace ile silme yapılıyorsa ve değer boşsa
    if (val === '') {
      onChange('')
      return
    }
    onChange(formatValue(val))
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { color: value ? color : colors.text.secondary }]}
        value={value}
        onChangeText={handleChange}
        placeholder="0"
        placeholderTextColor={colors.text.secondary}
        keyboardType="numeric"
        maxLength={10}
      />
      <Text style={[styles.currency, { color: value ? color : colors.text.secondary }]}>TL</Text>
    </View>
  )
} 