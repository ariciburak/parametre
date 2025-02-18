import React from 'react';
import { View, StyleSheet, Platform, Dimensions, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/common/Text';
import { colors, spacing } from '../../../theme';
import { Transaction } from '../../../types/transaction';
import { formatCurrency } from '../../../utils/currency';
import { getCategoryById } from '../../../constants/categories';

interface CategoryComparisonProps {
  transactions: Transaction[];
  period: {
    month: number;
    year: number;
  };
}

interface CategorySummary {
  categoryId: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - spacing.screen.sm * 2;

export const CategoryComparison = ({ transactions, period }: CategoryComparisonProps) => {
  const [selectedCategory, setSelectedCategory] = React.useState<CategorySummary | null>(null);

  const categorySummary = React.useMemo(() => {
    // Seçili ay için işlemleri filtrele
    const filteredTransactions = transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return date.getMonth() === period.month && 
             date.getFullYear() === period.year &&
             transaction.type === 'expense';
    });

    // Kategorilere göre toplamları hesapla
    const summary = filteredTransactions.reduce((acc, transaction) => {
      const categoryId = transaction.categoryId;
      if (!acc[categoryId]) {
        acc[categoryId] = {
          categoryId,
          amount: 0,
          transactionCount: 0,
          percentage: 0,
        };
      }
      acc[categoryId].amount += transaction.amount;
      acc[categoryId].transactionCount++;
      return acc;
    }, {} as Record<string, CategorySummary>);

    // Toplam harcamayı hesapla
    const totalExpense = Object.values(summary).reduce((sum, cat) => sum + cat.amount, 0);

    // Yüzdeleri hesapla ve sırala
    return Object.values(summary)
      .map(category => ({
        ...category,
        percentage: totalExpense > 0 ? (category.amount / totalExpense) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, period]);

  if (categorySummary.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Kategori Dağılımı</Text>
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="chart-pie"
            size={48}
            color={colors.grey[300]}
          />
          <Text style={styles.emptyText}>Bu ay için harcama bulunmuyor</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kategori Dağılımı</Text>
        {selectedCategory && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipAmount}>
              {formatCurrency(selectedCategory.amount)}
            </Text>
            <Text style={styles.tooltipPercentage}>
              %{selectedCategory.percentage.toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.categories}>
        {categorySummary.map(category => {
          const categoryInfo = getCategoryById(category.categoryId);
          if (!categoryInfo) return null;

          return (
            <Pressable
              key={category.categoryId}
              style={({ pressed }) => [
                styles.categoryItem,
                pressed && styles.categoryPressed,
                selectedCategory?.categoryId === category.categoryId && styles.categorySelected,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <View style={[styles.iconContainer, { backgroundColor: categoryInfo.color }]}>
                <MaterialCommunityIcons
                  name={categoryInfo.icon || 'help-circle'}
                  size={24}
                  color={colors.common.white}
                />
              </View>

              <View style={styles.categoryContent}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{categoryInfo.label}</Text>
                  <Text style={styles.categoryCount}>
                    {category.transactionCount} işlem
                  </Text>
                </View>

                <View style={styles.categoryDetails}>
                  <Text style={styles.categoryAmount}>
                    {formatCurrency(category.amount)}
                  </Text>
                  <Text style={styles.categoryPercentage}>
                    %{category.percentage.toFixed(1)}
                  </Text>
                </View>

                <View style={styles.progressContainer}>
                  <View 
                    style={[
                      styles.progressBar,
                      { backgroundColor: categoryInfo.color + '20' }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: categoryInfo.color,
                        width: `${category.percentage}%`
                      }
                    ]}
                  />
                </View>
              </View>
            </Pressable>
          );
        })}
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  tooltip: {
    backgroundColor: colors.grey[50],
    borderRadius: 12,
    padding: spacing.sm,
    alignItems: 'flex-end',
  },
  tooltipAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  tooltipPercentage: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  categories: {
    gap: spacing.sm,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grey[50],
    borderRadius: 12,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  categoryPressed: {
    opacity: 0.7,
  },
  categorySelected: {
    backgroundColor: colors.grey[100],
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
        elevation: 2,
      },
    }),
  },
  categoryContent: {
    flex: 1,
    gap: spacing.xs,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
  },
  categoryCount: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  categoryDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  categoryPercentage: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  progressContainer: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 4,
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
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
  },
}); 