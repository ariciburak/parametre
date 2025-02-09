import { colors } from '../theme'
import type { MaterialCommunityIcons } from '@expo/vector-icons'

export type TransactionType = 'income' | 'expense'

export type TransactionTypeOption = {
  value: TransactionType
  label: string
  icon: keyof typeof MaterialCommunityIcons.glyphMap
  color: string
}

export const transactionTypes: TransactionTypeOption[] = [
  {
    value: 'income',
    label: 'Gelir',
    icon: 'arrow-down',
    color: colors.secondary.main,
  },
  {
    value: 'expense',
    label: 'Gider',
    icon: 'arrow-up',
    color: colors.error.main,
  },
]

export const getTransactionTypeByValue = (value: TransactionType) => {
  return transactionTypes.find(type => type.value === value)
} 