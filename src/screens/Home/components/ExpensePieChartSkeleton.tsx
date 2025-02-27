import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '../../../components/common/Skeleton';
import { colors, spacing } from '../../../theme';

export const ExpensePieChartSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Skeleton width={160} height={24} />
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        <Skeleton width={200} height={200} borderRadius={100} style={styles.chart} />
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.legendItem}>
            <Skeleton width={16} height={16} borderRadius={8} style={styles.legendDot} />
            <View style={styles.legendText}>
              <Skeleton width={100} height={20} style={styles.legendLabel} />
              <Skeleton width={80} height={20} />
            </View>
          </View>
        ))}
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
    marginBottom: spacing.lg,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  chart: {
    marginVertical: spacing.lg,
  },
  legend: {
    gap: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    marginRight: spacing.sm,
  },
  legendText: {
    flex: 1,
  },
  legendLabel: {
    marginBottom: spacing.xs,
  },
}); 