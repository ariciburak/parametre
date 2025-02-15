import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../../../components/common/Text';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { LinearGradient } from 'expo-linear-gradient';
import { formatCurrency } from '../../../utils/currency';

interface BalanceCardProps {
  balance: number;
  income: number;
  expense: number;
}

export const BalanceCard = ({ balance, income, expense }: BalanceCardProps) => {
  return (
    <LinearGradient
      colors={["#4C5FBA", "#3A4D8C", "#1E2B58"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.4, 1]}
    >
      <View style={styles.balanceContainer}>
        <Text variant="label" style={styles.label}>
          Toplam Bakiye
        </Text>
        <Text variant="h1" style={styles.balance}>
          {formatCurrency(balance)}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text variant="label" style={styles.label}>
            Gelir
          </Text>
          <Text variant="h3" style={[styles.statValue, styles.income]}>
            {formatCurrency(income)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text variant="label" style={styles.label}>
            Gider
          </Text>
          <Text variant="h3" style={[styles.statValue, styles.expense]}>
            {formatCurrency(expense)}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: spacing.md,
    padding: spacing.lg,
    gap: spacing.xl,
  },
  balanceContainer: {
    gap: spacing.xs,
  },
  label: {
    color: colors.white,
    opacity: 0.8,
  },
  balance: {
    color: colors.white,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    gap: spacing.xs,
  },
  statValue: {
    color: colors.white,
  },
  income: {
    color: '#00B4FF',
  },
  expense: {
    color: '#FF6B6B',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.white,
    opacity: 0.2,
    marginHorizontal: spacing.md,
  },
}); 