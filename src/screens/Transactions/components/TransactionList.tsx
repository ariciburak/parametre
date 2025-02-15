import React from 'react'
import { View, StyleSheet, SectionList, Platform } from 'react-native'
import { Text } from '../../../components/common/Text'
import { colors, spacing } from '../../../theme'
import { Transaction } from '../../../types/transaction'
import { TransactionItem } from './TransactionItem'
import { formatCurrency } from '../../../utils/currency'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface TransactionSection {
  title: string
  totalIncome: number
  totalExpense: number
  data: Transaction[]
}

interface TransactionListProps {
  transactions: Transaction[]
  onTransactionPress?: (transaction: Transaction) => void
}

export const TransactionList = ({ transactions, onTransactionPress }: TransactionListProps) => {
  // İşlemleri tarihe göre grupla
  const sections = React.useMemo(() => {
    const groups = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date)
      const key = date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      if (!acc[key]) {
        acc[key] = {
          title: key,
          totalIncome: 0,
          totalExpense: 0,
          data: []
        }
      }

      if (transaction.type === 'income') {
        acc[key].totalIncome += transaction.amount
      } else {
        acc[key].totalExpense += transaction.amount
      }

      acc[key].data.push(transaction)
      return acc
    }, {} as Record<string, TransactionSection>)

    return Object.values(groups).sort((a, b) => {
      const dateA = new Date(a.data[0].date)
      const dateB = new Date(b.data[0].date)
      return dateB.getTime() - dateA.getTime()
    })
  }, [transactions])

  const renderSectionHeader = ({ section }: { section: TransactionSection }) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {section.title}
        </Text>
        <View style={styles.summaryContainer}>
          <View style={[styles.badge, section.totalIncome > section.totalExpense ? styles.incomeBadge : styles.expenseBadge]}>
            <MaterialCommunityIcons 
              name={section.totalIncome > section.totalExpense ? "arrow-up" : "arrow-down"} 
              size={12} 
              color={section.totalIncome > section.totalExpense ? colors.success.main : colors.error.main} 
              style={styles.badgeIcon}
            />
            <Text style={[styles.summaryAmount, section.totalIncome > section.totalExpense ? styles.income : styles.expense]}>
              {formatCurrency(Math.abs(section.totalIncome - section.totalExpense))}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.transactionsContainer}>
        {section.data.map((transaction, index) => (
          <React.Fragment key={transaction.id}>
            <TransactionItem 
              transaction={transaction} 
              onPress={() => onTransactionPress?.(transaction)}
            />
            {index < section.data.length - 1 && <View style={styles.separator} />}
          </React.Fragment>
        ))}
      </View>
    </View>
  )

  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Henüz işlem bulunmuyor
        </Text>
      </View>
    )
  }

  return (
    <SectionList
      sections={sections}
      renderSectionHeader={renderSectionHeader}
      renderItem={() => null}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { paddingBottom: Platform.OS === 'ios' ? 80 : 60 }]}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.md,
  },
  sectionContainer: {
    marginBottom: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screen.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.secondary,
    letterSpacing: 0.2,
  },
  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    backgroundColor: colors.grey[50],
  },
  incomeBadge: {
    backgroundColor: colors.success.main + '10', // %10 opacity
  },
  expenseBadge: {
    backgroundColor: colors.error.main + '10', // %10 opacity
  },
  badgeIcon: {
    marginRight: 4,
  },
  summaryAmount: {
    fontSize: 13,
    fontWeight: '600',
  },
  income: {
    color: colors.success.main,
  },
  expense: {
    color: colors.error.main,
  },
  transactionsContainer: {
    backgroundColor: colors.common.white,
    borderRadius: 16,
    marginHorizontal: spacing.screen.sm,
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
  separator: {
    height: 1,
    backgroundColor: colors.grey[100],
    marginLeft: spacing.screen.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
}) 