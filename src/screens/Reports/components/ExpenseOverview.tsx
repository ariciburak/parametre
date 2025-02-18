import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/common/Text';
import { colors, spacing } from '../../../theme';
import { Transaction } from '../../../types/transaction';
import { formatCurrency } from '../../../utils/currency';

interface ExpenseOverviewProps {
  transactions: Transaction[];
  period: {
    month: number;
    year: number;
  };
}

export const ExpenseOverview = ({ transactions, period }: ExpenseOverviewProps) => {
  const stats = React.useMemo(() => {
    // Bu ayki işlemleri filtrele
    const currentMonthTransactions = transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return date.getMonth() === period.month && 
             date.getFullYear() === period.year;
    });

    // Önceki ayki işlemleri filtrele
    const prevMonth = period.month === 0 ? 11 : period.month - 1;
    const prevYear = period.month === 0 ? period.year - 1 : period.year;
    const prevMonthTransactions = transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return date.getMonth() === prevMonth && 
             date.getFullYear() === prevYear;
    });

    // Bu ay için hesaplamalar
    const currentIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentExpense = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Önceki ay için hesaplamalar
    const prevIncome = prevMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const prevExpense = prevMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Değişim yüzdeleri
    const incomeChange = prevIncome === 0 
      ? 100 
      : ((currentIncome - prevIncome) / prevIncome) * 100;

    const expenseChange = prevExpense === 0 
      ? 100 
      : ((currentExpense - prevExpense) / prevExpense) * 100;

    return {
      currentIncome,
      currentExpense,
      balance: currentIncome - currentExpense,
      incomeChange,
      expenseChange,
      transactionCount: currentMonthTransactions.length,
    };
  }, [transactions, period]);

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Aylık Özet</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{stats.transactionCount} İşlem</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        {/* Gelir Özeti */}
        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <MaterialCommunityIcons
              name="arrow-down"
              size={20}
              color={colors.success.main}
            />
            <Text style={styles.statLabel}>Gelir</Text>
            <View style={[
              styles.changeIndicator,
              { backgroundColor: stats.incomeChange >= 0 ? colors.success.main + '20' : colors.error.main + '20' }
            ]}>
              <Text style={[
                styles.changeText,
                { color: stats.incomeChange >= 0 ? colors.success.main : colors.error.main }
              ]}>
                {formatPercentage(stats.incomeChange)}
              </Text>
            </View>
          </View>
          <Text style={[styles.amount, { color: colors.success.main }]}>
            {formatCurrency(stats.currentIncome)}
          </Text>
        </View>

        {/* Gider Özeti */}
        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <MaterialCommunityIcons
              name="arrow-up"
              size={20}
              color={colors.error.main}
            />
            <Text style={styles.statLabel}>Gider</Text>
            <View style={[
              styles.changeIndicator,
              { backgroundColor: stats.expenseChange <= 0 ? colors.success.main + '20' : colors.error.main + '20' }
            ]}>
              <Text style={[
                styles.changeText,
                { color: stats.expenseChange <= 0 ? colors.success.main : colors.error.main }
              ]}>
                {formatPercentage(stats.expenseChange)}
              </Text>
            </View>
          </View>
          <Text style={[styles.amount, { color: colors.error.main }]}>
            {formatCurrency(stats.currentExpense)}
          </Text>
        </View>

        {/* Bakiye */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Net Bakiye</Text>
          <Text style={[
            styles.balanceAmount,
            { color: stats.balance >= 0 ? colors.success.main : colors.error.main }
          ]}>
            {formatCurrency(stats.balance)}
          </Text>
        </View>
      </View>
    </View>
  );
};

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
    fontWeight: '600',
    color: colors.text.primary,
  },
  badge: {
    backgroundColor: colors.primary.main + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: colors.primary.main,
    fontWeight: '500',
  },
  statsContainer: {
    gap: spacing.md,
  },
  statItem: {
    backgroundColor: colors.grey[50],
    padding: spacing.md,
    borderRadius: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
    flex: 1,
  },
  changeIndicator: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  amount: {
    fontSize: 20,
    fontWeight: '600',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.grey[50],
    padding: spacing.md,
    borderRadius: 12,
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
}); 