import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../../components/common/Text';
import { colors, spacing } from '../../../../theme';
import { formatCurrency } from '../../../../utils/currency';
import { getCategoryById } from '../../../../constants/categories';
import type { Transaction } from '../../../../types/transaction';
import { VictoryPie } from 'victory-native';

interface CategoryDistributionWidgetProps {
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
  color: string;
}

const CHART_SIZE = Dimensions.get('window').width * 0.5;

export const CategoryDistributionWidget = ({ transactions, period }: CategoryDistributionWidgetProps) => {
  const categorySummary = React.useMemo(() => {
    // Seçili dönemdeki gider işlemlerini filtrele
    const filteredTransactions = transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return (
        date.getMonth() === period.month &&
        date.getFullYear() === period.year &&
        transaction.type === 'expense'
      );
    });

    // Kategorilere göre topla
    const summary = filteredTransactions.reduce((acc, transaction) => {
      const categoryId = transaction.categoryId;
      if (!acc[categoryId]) {
        const category = getCategoryById(categoryId);
        acc[categoryId] = {
          categoryId,
          amount: 0,
          percentage: 0,
          color: category?.color || colors.grey[500],
        };
      }
      acc[categoryId].amount += transaction.amount;
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

  const chartData = categorySummary.map(category => ({
    x: category.categoryId,
    y: category.amount,
    color: category.color,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kategori Dağılımı</Text>

      {categorySummary.length > 0 ? (
        <>
          <View style={styles.chartContainer}>
            <VictoryPie
              data={chartData}
              width={CHART_SIZE}
              height={CHART_SIZE}
              colorScale={chartData.map(d => d.color)}
              innerRadius={CHART_SIZE * 0.2}
              labelRadius={CHART_SIZE * 0.3}
              style={{ labels: { display: 'none' } }}
              animate={{ duration: 500 }}
            />
          </View>

          <View style={styles.legendContainer}>
            {categorySummary.map(category => {
              const categoryInfo = getCategoryById(category.categoryId);
              if (!categoryInfo) return null;

              return (
                <View key={category.categoryId} style={styles.legendItem}>
                  <View style={styles.legendLeft}>
                    <View style={[styles.colorIndicator, { backgroundColor: category.color }]} />
                    <Text style={styles.categoryName}>{categoryInfo.label}</Text>
                  </View>
                  <View style={styles.legendRight}>
                    <Text style={styles.amount}>{formatCurrency(category.amount)}</Text>
                    <Text style={styles.percentage}>%{category.percentage.toFixed(1)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="chart-pie"
            size={48}
            color={colors.grey[300]}
          />
          <Text style={styles.emptyText}>Bu dönem için harcama verisi bulunmuyor</Text>
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
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  legendContainer: {
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: 14,
    color: colors.text.primary,
  },
  legendRight: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  percentage: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
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