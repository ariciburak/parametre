import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../../components/common/Text';
import { colors, spacing } from '../../../../theme';
import { formatCurrency } from '../../../../utils/currency';
import type { Transaction } from '../../../../types/transaction';

interface FinancialSummaryWidgetProps {
  transactions: Transaction[];
  period: {
    month: number;
    year: number;
  };
}

export const FinancialSummaryWidget = ({ transactions, period }: FinancialSummaryWidgetProps) => {
  const stats = React.useMemo(() => {
    const filteredTransactions = transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return (
        date.getMonth() === period.month &&
        date.getFullYear() === period.year
      );
    });

    return filteredTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += transaction.amount;
        } else {
          acc.expense += transaction.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [transactions, period]);

  const balance = stats.income - stats.expense;
  const savingsRate = stats.income > 0 ? ((stats.income - stats.expense) / stats.income) * 100 : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finansal Özet</Text>

      <View style={styles.statsContainer}>
        {/* Gelir */}
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: colors.success.light }]}>
            <MaterialCommunityIcons
              name="arrow-down"
              size={20}
              color={colors.success.main}
            />
          </View>
          <View>
            <Text style={styles.statLabel}>Gelir</Text>
            <Text style={[styles.statValue, { color: colors.success.main }]}>
              {formatCurrency(stats.income)}
            </Text>
          </View>
        </View>

        {/* Gider */}
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: colors.error.light }]}>
            <MaterialCommunityIcons
              name="arrow-up"
              size={20}
              color={colors.error.main}
            />
          </View>
          <View>
            <Text style={styles.statLabel}>Gider</Text>
            <Text style={[styles.statValue, { color: colors.error.main }]}>
              {formatCurrency(stats.expense)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.balanceContainer}>
        <View>
          <Text style={styles.balanceLabel}>Net Bakiye</Text>
          <Text style={[styles.balanceValue, { color: balance >= 0 ? colors.success.main : colors.error.main }]}>
            {formatCurrency(balance)}
          </Text>
        </View>

        <View style={styles.savingsContainer}>
          <Text style={styles.savingsLabel}>Tasarruf Oranı</Text>
          <Text style={[styles.savingsValue, { color: savingsRate >= 0 ? colors.success.main : colors.error.main }]}>
            %{savingsRate.toFixed(1)}
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.grey[50],
    padding: spacing.sm,
    borderRadius: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.grey[200],
    marginVertical: spacing.md,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  savingsContainer: {
    alignItems: 'flex-end',
  },
  savingsLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  savingsValue: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 