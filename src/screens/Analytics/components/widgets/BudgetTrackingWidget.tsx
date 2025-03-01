import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../../components/common/Text';
import { colors, spacing } from '../../../../theme';
import { formatCurrency } from '../../../../utils/currency';
import { getCategoryById } from '../../../../constants/categories';
import type { Transaction } from '../../../../types/transaction';
import type { Budget } from '../../../../types/budget';
import useBudgetStore from '../../../../store/useBudgetStore';

interface BudgetTrackingWidgetProps {
  transactions: Transaction[];
  period: {
    month: number;
    year: number;
  };
}

interface BudgetProgress {
  categoryId: string;
  budgetAmount: number;
  spentAmount: number;
  percentage: number;
  daysLeft: number;
  projectedOverspend: number;
  status: 'safe' | 'warning' | 'danger';
}

export const BudgetTrackingWidget = ({ transactions, period }: BudgetTrackingWidgetProps) => {
  const { getBudgetsByMonth } = useBudgetStore();
  
  const budgetProgress = React.useMemo(() => {
    // Ay için bütçeleri al
    const monthStr = `${period.year}-${String(period.month + 1).padStart(2, '0')}`;
    const budgets = getBudgetsByMonth(monthStr);

    // Ayın toplam gün sayısı ve kalan gün sayısı
    const today = new Date();
    const daysInMonth = new Date(period.year, period.month + 1, 0).getDate();
    const currentDay = period.year === today.getFullYear() && period.month === today.getMonth()
      ? today.getDate()
      : daysInMonth;
    const daysLeft = daysInMonth - currentDay;

    // Her bütçe için ilerlemeyi hesapla
    const progress: BudgetProgress[] = budgets.map(budget => {
      const spentAmount = budget.spent || 0;
      const percentage = (spentAmount / budget.amount) * 100;
      
      // Tahmini aşım miktarı (günlük ortalama harcamaya göre)
      const dailyAverage = spentAmount / currentDay;
      const projectedTotal = spentAmount + (dailyAverage * daysLeft);
      const projectedOverspend = Math.max(0, projectedTotal - budget.amount);

      // Durum belirleme
      let status: 'safe' | 'warning' | 'danger' = 'safe';
      if (percentage >= 100) {
        status = 'danger';
      } else if (percentage >= 80 || projectedOverspend > 0) {
        status = 'warning';
      }

      return {
        categoryId: budget.categoryId,
        budgetAmount: budget.amount,
        spentAmount,
        percentage,
        daysLeft,
        projectedOverspend,
        status,
      };
    }).sort((a, b) => b.percentage - a.percentage);

    return progress;
  }, [transactions, period, getBudgetsByMonth]);

  const totalBudget = budgetProgress.reduce((sum, b) => sum + b.budgetAmount, 0);
  const totalSpent = budgetProgress.reduce((sum, b) => sum + b.spentAmount, 0);
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bütçe Takibi</Text>

      {budgetProgress.length > 0 ? (
        <>
          {/* Genel Durum */}
          <View style={styles.overallStatus}>
            <View style={styles.statusHeader}>
              <Text style={styles.statusLabel}>Genel Bütçe Durumu</Text>
              <MaterialCommunityIcons
                name={overallPercentage >= 100 ? 'alert-circle' : 'check-circle'}
                size={24}
                color={overallPercentage >= 100 ? colors.error.main : colors.success.main}
              />
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${Math.min(100, overallPercentage)}%`,
                    backgroundColor: overallPercentage >= 100 
                      ? colors.error.main 
                      : overallPercentage >= 80 
                        ? colors.warning.main 
                        : colors.success.main
                  }
                ]} 
              />
            </View>
            <View style={styles.statusDetails}>
              <Text style={styles.spentAmount}>
                {formatCurrency(totalSpent)}
                <Text style={styles.totalAmount}>
                  {' '}/ {formatCurrency(totalBudget)}
                </Text>
              </Text>
              <Text style={styles.percentageText}>
                %{Math.round(overallPercentage)}
              </Text>
            </View>
          </View>

          {/* Kategori Bazında Bütçeler */}
          <View style={styles.categoriesContainer}>
            {budgetProgress.map(budget => {
              const category = getCategoryById(budget.categoryId);
              if (!category) return null;

              return (
                <View key={budget.categoryId} style={styles.categoryItem}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryInfo}>
                      <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                        <MaterialCommunityIcons
                          name={category.icon}
                          size={16}
                          color={colors.common.white}
                        />
                      </View>
                      <Text style={styles.categoryName}>{category.label}</Text>
                    </View>
                    <Text 
                      style={[
                        styles.statusBadge,
                        { 
                          backgroundColor: budget.status === 'danger' 
                            ? colors.error.light 
                            : budget.status === 'warning'
                              ? colors.warning.light
                              : colors.success.light,
                          color: budget.status === 'danger'
                            ? colors.error.main
                            : budget.status === 'warning'
                              ? colors.warning.main
                              : colors.success.main
                        }
                      ]}
                    >
                      {budget.status === 'danger'
                        ? 'Aşıldı'
                        : budget.status === 'warning'
                          ? 'Riskli'
                          : 'İyi'}
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { 
                          width: `${Math.min(100, budget.percentage)}%`,
                          backgroundColor: budget.status === 'danger'
                            ? colors.error.main
                            : budget.status === 'warning'
                              ? colors.warning.main
                              : colors.success.main
                        }
                      ]} 
                    />
                  </View>
                  <View style={styles.budgetDetails}>
                    <Text style={styles.spentAmount}>
                      {formatCurrency(budget.spentAmount)}
                      <Text style={styles.totalAmount}>
                        {' '}/ {formatCurrency(budget.budgetAmount)}
                      </Text>
                    </Text>
                    <Text style={styles.daysLeft}>
                      {budget.daysLeft} gün kaldı
                    </Text>
                  </View>
                  {budget.projectedOverspend > 0 && (
                    <Text style={styles.warningText}>
                      Bu hızda devam edilirse{' '}
                      <Text style={styles.overspendAmount}>
                        {formatCurrency(budget.projectedOverspend)}
                      </Text>
                      {' '}aşım bekleniyor
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="wallet-outline"
            size={48}
            color={colors.grey[300]}
          />
          <Text style={styles.emptyText}>
            Bu ay için henüz bütçe oluşturulmamış
          </Text>
        </View>
      )}
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
  overallStatus: {
    backgroundColor: colors.grey[50],
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.grey[200],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statusDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  totalAmount: {
    color: colors.text.secondary,
    fontWeight: '400',
  },
  percentageText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  categoriesContainer: {
    gap: spacing.sm,
  },
  categoryItem: {
    backgroundColor: colors.grey[50],
    borderRadius: 12,
    padding: spacing.sm,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  categoryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  budgetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  daysLeft: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  warningText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  overspendAmount: {
    color: colors.error.main,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
}); 