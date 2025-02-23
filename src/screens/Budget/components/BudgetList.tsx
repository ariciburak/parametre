import React from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text } from '../../../components/common/Text'
import { colors, spacing } from '../../../theme'
import { BudgetWithCategory } from '../../../types/budget'
import { formatCurrency } from '../../../utils/currency'

interface BudgetListProps {
  budgets: BudgetWithCategory[]
  onBudgetPress: (budget: BudgetWithCategory) => void
}

export const BudgetList = ({ budgets, onBudgetPress }: BudgetListProps) => {
  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return colors.error.main
    if (percentage >= 80) return colors.warning.main
    return colors.success.main
  }

  if (budgets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="wallet-outline"
          size={48}
          color={colors.grey[300]}
        />
        <Text style={styles.emptyText}>
          Henüz bütçe oluşturmadınız
        </Text>
        <Text style={styles.emptySubText}>
          Kategori bazlı bütçe oluşturmak için + butonuna tıklayın
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kategori Bütçeleri</Text>

      {budgets.map((budget) => (
        <Pressable
          key={budget.id}
          style={({ pressed }) => [
            styles.budgetItem,
            pressed && styles.pressed,
          ]}
          onPress={() => onBudgetPress(budget)}
        >
          {/* Kategori başlığı */}
          <View style={styles.categoryHeader}>
            <View style={styles.categoryInfo}>
              <View style={[styles.categoryIcon, { backgroundColor: budget.category.color }]}>
                <MaterialCommunityIcons
                  name={budget.category.icon}
                  size={20}
                  color={colors.common.white}
                />
              </View>
              <Text style={styles.categoryName}>{budget.category.label}</Text>
            </View>
            <Text style={[styles.percentage, { color: getStatusColor(budget.percentage) }]}>
              %{budget.percentage.toFixed(1)}
            </Text>
          </View>

          {/* Bütçe detayları */}
          <View style={styles.itemDetails}>
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Bütçe</Text>
              <Text style={styles.amount}>
                {formatCurrency(budget.amount)}
              </Text>
            </View>

            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Harcanan</Text>
              <Text style={[styles.amount, { color: colors.error.main }]}>
                {formatCurrency(budget.spent)}
              </Text>
            </View>

            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Kalan</Text>
              <Text style={[styles.amount, { color: colors.success.main }]}>
                {formatCurrency(budget.amount - budget.spent)}
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
                    width: `${Math.min(budget.percentage, 100)}%`,
                    backgroundColor: getStatusColor(budget.percentage),
                  },
                ]}
              />
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  budgetItem: {
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 12,
    padding: spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  amountContainer: {
    flex: 1,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  amount: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  progressContainer: {
    marginTop: spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.grey[100],
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  emptyContainer: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
}) 