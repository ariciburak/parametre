import React from 'react'
import { View, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text } from '../../../components/common/Text'
import { colors, spacing } from '../../../theme'
import { MonthlyBudgetSummary } from '../../../types/budget'
import { formatCurrency } from '../../../utils/currency'

interface BudgetSummaryProps {
  summary: MonthlyBudgetSummary
}

export const BudgetSummary = ({ summary }: BudgetSummaryProps) => {
  const getStatusColor = () => {
    if (summary.percentage >= 100) return colors.error.main
    if (summary.percentage >= 80) return colors.warning.main
    return colors.success.main
  }

  const getStatusIcon = () => {
    if (summary.percentage >= 100) return 'alert-circle'
    if (summary.percentage >= 80) return 'alert'
    return 'check-circle'
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bütçe Durumu</Text>
        <View style={[styles.badge, { backgroundColor: getStatusColor() + '20' }]}>
          <MaterialCommunityIcons
            name={getStatusIcon()}
            size={16}
            color={getStatusColor()}
          />
          <Text style={[styles.badgeText, { color: getStatusColor() }]}>
            %{summary.percentage.toFixed(1)}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Toplam Bütçe</Text>
          <Text style={styles.statValue}>
            {formatCurrency(summary.totalBudget)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Harcanan</Text>
          <Text style={[styles.statValue, { color: colors.error.main }]}>
            {formatCurrency(summary.totalSpent)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Kalan</Text>
          <Text style={[styles.statValue, { color: colors.success.main }]}>
            {formatCurrency(summary.totalBudget - summary.totalSpent)}
          </Text>
        </View>
      </View>

      {/* İlerleme çubuğu */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(summary.percentage, 100)}%`,
                backgroundColor: getStatusColor(),
              },
            ]}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border.light,
  },
  progressContainer: {
    marginTop: spacing.xs,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.grey[100],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
}) 