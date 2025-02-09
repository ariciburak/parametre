import React from 'react'
import { View, StyleSheet, TextInput } from 'react-native'
import { Text } from '../../../components/common/Text'
import { colors } from '../../../theme'
import type { TransactionType } from '../../../constants/transactions'

type Props = {
  value: string
  type: TransactionType
  onChange: (value: string) => void
}

export const AmountInput = ({ value, type, onChange }: Props) => {
  const color = type === 'income' ? colors.secondary.main : colors.error.main

  return (
    <View style={styles.container}>
      <Text style={[styles.currency, { color }]}>₺</Text>
      <TextInput
        style={[styles.input, { color }]}
        value={value}
        onChangeText={onChange}
        placeholder="0.00"
        placeholderTextColor={color}
        keyboardType="decimal-pad"
        maxLength={10}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  currency: {
    fontSize: 48,
    fontWeight: '600',
    marginRight: 8,
  },
  input: {
    fontSize: 48,
    fontWeight: '600',
    minWidth: 120,
    textAlign: 'center',
  },
}) 