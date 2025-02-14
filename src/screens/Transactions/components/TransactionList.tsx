import React from 'react'
import { View, StyleSheet, SectionList, Platform } from 'react-native'
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
    <View style={styles.sectionCard}>
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
      SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.screen.sm,
  },
  sectionCard: {
    backgroundColor: colors.common.white,
    borderRadius: spacing.md,
    padding: spacing.md,
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
  sectionHeader: {
    marginBottom: spacing.md,
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
  },
  summaryText: {
    fontSize: 15,
    fontWeight: '600',
  },
  income: {
    color: colors.success.main,
  },
  expense: {
    color: colors.error.main,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing.sm,
  },
  sectionSeparator: {
    height: spacing.md,
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