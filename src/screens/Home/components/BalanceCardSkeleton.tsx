import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '../../../components/common/Skeleton';
import { colors, spacing } from '../../../theme';

export const BalanceCardSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Period Selector */}
      <View style={styles.periodSelector}>
        <Skeleton width={120} height={32} borderRadius={16} />
      </View>

      {/* Balance */}
      <View style={styles.balanceContainer}>
        <Skeleton width={180} height={24} style={styles.label} />
        <Skeleton width={250} height={40} style={styles.amount} />
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Skeleton width={80} height={20} style={styles.statLabel} />
          <Skeleton width={120} height={24} style={styles.statValue} />
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Skeleton width={80} height={20} style={styles.statLabel} />
          <Skeleton width={120} height={24} style={styles.statValue} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.common.white,
    borderRadius: 24,
    padding: spacing.lg,
  },
  periodSelector: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  label: {
    marginBottom: spacing.xs,
  },
  amount: {
    marginBottom: spacing.md,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    marginBottom: spacing.xs,
  },
  statValue: {
    marginBottom: spacing.xs,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.grey[200],
    marginHorizontal: spacing.md,
  },
}); 