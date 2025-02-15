import React from 'react'
import { View, StyleSheet, Pressable, Platform } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text } from '../../../components/common/Text'
import { colors, spacing } from '../../../theme'
import { Transaction } from '../../../types/transaction'
import { formatCurrency } from '../../../utils/currency'
import { getCategoryById } from '../../../constants/categories'
import { useNavigation } from '@react-navigation/native'

interface RecentTransactionsProps {
  transactions: Transaction[]
  onSeeAll?: () => void
  onTransactionPress?: (transaction: Transaction) => void
}

export const RecentTransactions = ({ 
  transactions, 
  onSeeAll,
  onTransactionPress 
}: RecentTransactionsProps) => {
  const recentTransactions = transactions.slice(0, 3)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h3" style={styles.title}>Son İşlemler</Text>
        <Pressable 
          onPress={onSeeAll}
          style={({ pressed }) => [
            styles.seeAllButton,
            pressed && styles.pressed
          ]}
        >
          <Text style={styles.seeAllText}>Tümünü Gör</Text>
          <MaterialCommunityIcons 
            name="chevron-right" 
            size={20} 
            color={colors.primary.main}
          />
        </Pressable>
      </View>

      <View style={styles.transactionList}>
        {recentTransactions.map((transaction, index) => {
          const category = getCategoryById(transaction.categoryId)
          const date = new Date(transaction.date)

          return (
            <Pressable
              key={transaction.id}
              style={({ pressed }) => [
                styles.transactionItem,
                pressed && styles.pressed,
                index < recentTransactions.length - 1 && styles.itemBorder
              ]}
              onPress={() => onTransactionPress?.(transaction)}
            >
              <View style={[styles.iconContainer, { backgroundColor: category?.color }]}>
                <MaterialCommunityIcons
                  name={category?.icon || 'help'}
                  size={20}
                  color={colors.common.white}
                />
              </View>

              <View style={styles.transactionInfo}>
                <Text style={styles.categoryName}>
                  {category?.label || 'Diğer'}
                </Text>
                <Text style={styles.date}>
                  {date.toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </Text>
              </View>

              <Text
                style={[
                  styles.amount,
                  transaction.type === 'income' ? styles.income : styles.expense
                ]}
              >
                {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.common.white,
    borderRadius: 16,
    padding: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: colors.grey[900],
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    color: colors.text.primary,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: -8,
  },
  pressed: {
    opacity: 0.7,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary.main,
    marginRight: 4,
  },
  transactionList: {
    gap: spacing.sm,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
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
        elevation: 2,
      },
    }),
  },
  transactionInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 2,
  },
  date: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
  },
  income: {
    color: colors.success.main,
  },
  expense: {
    color: colors.error.main,
  },
}) 