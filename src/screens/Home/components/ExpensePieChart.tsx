import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { VictoryPie, VictoryLabel } from 'victory-native';
import { Text } from '../../../components/common/Text';
import { colors, spacing } from '../../../theme';
import { Transaction } from '../../../types/transaction';
import { getCategoryById } from '../../../constants/categories';
import { formatCurrency } from '../../../utils/currency';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ExpensePieChartProps {
  transactions: Transaction[];
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_SIZE = SCREEN_WIDTH - spacing.screen.sm * 4;

export const ExpensePieChart = ({ transactions }: ExpensePieChartProps) => {
  const chartData = React.useMemo(() => {
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const category = getCategoryById(transaction.categoryId);
        if (!category) return acc;

        if (!acc[category.id]) {
          acc[category.id] = {
            categoryId: category.id,
            label: category.label,
            icon: category.icon,
            color: category.color,
            amount: 0,
          };
        }
        acc[category.id].amount += transaction.amount;
        return acc;
      }, {} as Record<string, any>);

    const totalExpense = Object.values(expensesByCategory).reduce(
      (sum, cat) => sum + cat.amount,
      0
    );

    const data = Object.values(expensesByCategory)
      .sort((a, b) => b.amount - a.amount)
      .map((category) => ({
        ...category,
        y: category.amount,
        percentage: totalExpense > 0 ? (category.amount / totalExpense) * 100 : 0,
      }));

    return { data, totalExpense };
  }, [transactions]);

  if (chartData.data.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Harcama Dağılımı</Text>
      <Text style={styles.amount}>{formatCurrency(chartData.totalExpense)}</Text>
      
      <View style={styles.chartContainer}>
        <VictoryPie
          standalone={true}
          data={chartData.data}
          width={CHART_SIZE}
          height={CHART_SIZE}
          padding={CHART_SIZE * 0.1}
          innerRadius={15}
          cornerRadius={8}
          padAngle={1}
          startAngle={90}
          endAngle={450}
          colorScale={chartData.data.map(d => d.color)}
          labels={() => null}
          style={{
            data: {
              stroke: colors.common.white,
              strokeWidth: 1,
            },
          }}
          animate={{
            duration: 1000,
            easing: "cubic"
          }}
        />
      </View>

      <View style={styles.legendContainer}>
        {chartData.data.map((category) => (
          <View key={category.categoryId} style={styles.legendItem}>
            <View style={styles.legendLeft}>
              <View style={[styles.legendIcon, { backgroundColor: category.color }]}>
                <MaterialCommunityIcons
                  name={category.icon}
                  size={16}
                  color={colors.common.white}
                />
              </View>
              <Text style={styles.legendLabel}>{category.label}</Text>
            </View>
            <View style={styles.legendRight}>
              <Text style={styles.legendPercentage}>%{Math.round(category.percentage)}</Text>
              <Text style={styles.legendAmount}>{formatCurrency(category.amount)}</Text>
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
    borderRadius: 16,
    padding: spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  amount: {
    fontSize: 15,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: CHART_SIZE,
    position: 'relative',
    marginBottom: spacing.md,
  },
  legendContainer: {
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendLabel: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
  legendRight: {
    alignItems: 'flex-end',
  },
  legendPercentage: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '600',
  },
  legendAmount: {
    fontSize: 13,
    color: colors.text.secondary,
  },
}); 