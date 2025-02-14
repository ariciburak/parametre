import React from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text } from '../../../components/common/Text'
import { colors, spacing } from '../../../theme'
import { Transaction } from '../../../types/transaction'
import { formatCurrency } from '../../../utils/currency'
import { getCategoryById } from '../../../constants/categories'

interface TransactionItemProps {
  transaction: Transaction
  onPress?: () => void
}

export const TransactionItem = ({ transaction, onPress }: TransactionItemProps) => {
  const category = getCategoryById(transaction.categoryId)

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: category?.color }]}>
        <MaterialCommunityIcons
          name={category?.icon || 'help'}
          size={20}
          color={colors.common.white}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>
            {category?.label || 'Diğer'}
          </Text>
          <Text
            style={[
              styles.amount,
              transaction.type === 'income' ? styles.income : styles.expense,
            ]}
          >
            {formatCurrency(transaction.amount)}
          </Text>
        </View>

        {transaction.description && (
          <Text style={styles.description} numberOfLines={1}>
            {transaction.description}
          </Text>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: colors.grey[50],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  income: {
    color: colors.success.main,
  },
  expense: {
    color: colors.error.main,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
}) 