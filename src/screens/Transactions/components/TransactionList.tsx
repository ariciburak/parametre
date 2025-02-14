import React from 'react'
import { View, StyleSheet, SectionList } from 'react-native'
import { Text } from '../../../components/common/Text'
import { colors, spacing } from '../../../theme'
import { Transaction } from '../../../types/transaction'
import { TransactionItem } from './TransactionItem'
import { formatCurrency } from '../../../utils/currency'

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
    <View style={styles.sectionHeader}>
      <Text variant="h3" style={styles.sectionTitle}>
        {section.title}
      </Text>
      <View style={styles.sectionSummary}>
        <Text style={[styles.summaryText, styles.income]}>
          {formatCurrency(section.totalIncome)}
        </Text>
        <Text style={[styles.summaryText, styles.expense]}>
          {formatCurrency(section.totalExpense)}
        </Text>
      </View>
    </View>
  )

  const renderItem = ({ item }: { item: Transaction }) => (
    <TransactionItem 
      transaction={item} 
      onPress={() => onTransactionPress?.(item)}
    />
  )

  const renderSeparator = () => <View style={styles.separator} />

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
      renderItem={renderItem}
      stickySectionHeadersEnabled
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.screen.sm,
  },
  sectionHeader: {
    backgroundColor: colors.background.default,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    marginTop: spacing.md,
  },
  sectionTitle: {
    color: colors.text.primary,
    marginBottom: spacing.xs,
    fontSize: 18,
    fontWeight: '600',
  },
  sectionSummary: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.grey[50],
    padding: spacing.xs,
    borderRadius: spacing.xs,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  income: {
    color: colors.success.main,
  },
  expense: {
    color: colors.error.main,
  },
  separator: {
    height: spacing.xs,
    backgroundColor: colors.grey[100],
    marginVertical: spacing.xs,
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