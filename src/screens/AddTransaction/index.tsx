import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../theme'
import { TransactionTypeSelector } from './components/TransactionTypeSelector'
import { AmountInput } from './components/AmountInput'
import type { TransactionType } from '../../constants/transactions'
import type { TransactionFormValues } from '../../types/transaction'

export const AddTransactionScreen = () => {
  const [formValues, setFormValues] = useState<TransactionFormValues>({
    type: 'expense',
    amount: '',
    categoryId: '',
    date: new Date(),
  })

  const handleChange = (field: keyof TransactionFormValues, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TransactionTypeSelector
          value={formValues.type}
          onChange={(value: TransactionType) => handleChange('type', value)}
        />
        <AmountInput
          value={formValues.amount}
          type={formValues.type}
          onChange={value => handleChange('amount', value)}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  content: {
    flex: 1,
    padding: 16,
  },
}) 