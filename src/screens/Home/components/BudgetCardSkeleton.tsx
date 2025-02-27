import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '../../../components/common/Skeleton';
import { colors, spacing } from '../../../theme';

export const BudgetCardSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Skeleton width={120} height={24} />
        <Skeleton width={80} height={24} borderRadius={12} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Skeleton width="100%" height={8} borderRadius={4} />
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Skeleton width={80} height={20} style={styles.statLabel} />
          <Skeleton width={100} height={24} style={styles.statValue} />
        </View>
        <View style={styles.statItem}>
          <Skeleton width={80} height={20} style={styles.statLabel} />
          <Skeleton width={100} height={24} style={styles.statValue} />
        </View>
        <View style={styles.statItem}>
          <Skeleton width={80} height={20} style={styles.statLabel} />
          <Skeleton width={100} height={24} style={styles.statValue} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  progressContainer: {
    marginBottom: spacing.lg,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    marginBottom: spacing.xs,
  },
  statValue: {
    marginBottom: spacing.xs,
  },
}); 