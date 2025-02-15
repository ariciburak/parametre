import React from 'react'
import { View, StyleSheet, Pressable, ViewStyle, TextStyle, Platform } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text } from '../../../components/common/Text'
import { colors, spacing, typography } from '../../../theme'
import { Transaction } from '../../../types/transaction'
import { formatCurrency } from '../../../utils/currency'
import { getCategoryById } from '../../../constants/categories'

interface TransactionItemProps {
  transaction: Transaction
  onPress?: () => void
}

interface Styles {
  container: ViewStyle
  pressed: ViewStyle
  iconContainer: ViewStyle
  content: ViewStyle
  mainContent: ViewStyle
  title: TextStyle
  description: TextStyle
  amount: TextStyle
  income: TextStyle
  expense: TextStyle
  chevron: ViewStyle
  rightContent: ViewStyle
  dateText: TextStyle
}

export const TransactionItem = ({ transaction, onPress }: TransactionItemProps) => {
  const category = getCategoryById(transaction.categoryId)
  const date = new Date(transaction.date)

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
          size={18}
          color={colors.common.white}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.mainContent}>
          <Text style={styles.title}>
            {category?.label || 'Diğer'}
          </Text>
          {transaction.description && (
            <Text style={styles.description} numberOfLines={1}>
              {transaction.description}
            </Text>
          )}
        </View>

        <View style={styles.rightContent}>
          <Text
            style={[
              styles.amount,
              transaction.type === 'income' ? styles.income : styles.expense,
            ]}
          >
            {formatCurrency(transaction.amount)}
          </Text>
          <Text style={styles.dateText}>
            {date.toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'short'
            })}
          </Text>
        </View>
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={18}
        color={colors.grey[400]}
        style={styles.chevron}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.common.white,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.screen.sm,
    minHeight: 64,
    borderRadius: 12
  },
  pressed: {
    backgroundColor: colors.grey[50],
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.grey[900],
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: spacing.sm,
    marginRight: spacing.xs,
  },
  mainContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: typography.weight.medium,
    marginBottom: 1,
  },
  description: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 16,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 15,
    fontWeight: typography.weight.semibold,
    marginBottom: 1,
  },
  income: {
    color: colors.success.main,
  },
  expense: {
    color: colors.error.main,
  },
  dateText: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 15,
  },
  chevron: {
    marginLeft: spacing.xs,
  },
}) 