import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { Text } from '../../../../components/common/Text';
import { colors, spacing } from '../../../../theme';
import { formatCurrency } from '../../../../utils/currency';
import type { Transaction } from '../../../../types/transaction';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryLegend } from 'victory-native';

interface TrendAnalysisWidgetProps {
  transactions: Transaction[];
  period: {
    month: number;
    year: number;
  };
}

interface DailyTotal {
  date: Date;
  income: number;
  expense: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING_HORIZONTAL = spacing.md * 2; // Container padding
const CHART_WIDTH = SCREEN_WIDTH - PADDING_HORIZONTAL - spacing.screen.sm * 2; // Account for screen padding

export const TrendAnalysisWidget = ({ transactions, period }: TrendAnalysisWidgetProps) => {
  const dailyTotals = React.useMemo(() => {
    // Seçili aydaki işlemleri filtrele
    const filteredTransactions = transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return (
        date.getMonth() === period.month &&
        date.getFullYear() === period.year
      );
    });

    // Günlük toplamları hesapla
    const totals = new Map<string, DailyTotal>();
    
    // Ayın tüm günlerini oluştur
    const daysInMonth = new Date(period.year, period.month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(period.year, period.month, day);
      totals.set(date.toISOString().split('T')[0], {
        date,
        income: 0,
        expense: 0,
      });
    }

    // İşlemleri günlere göre topla
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date).toISOString().split('T')[0];
      const current = totals.get(date) || {
        date: new Date(transaction.date),
        income: 0,
        expense: 0,
      };

      if (transaction.type === 'income') {
        current.income += transaction.amount;
      } else {
        current.expense += transaction.amount;
      }

      totals.set(date, current);
    });

    return Array.from(totals.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [transactions, period]);

  const chartData = {
    income: dailyTotals.map((day, index) => ({ x: index + 1, y: day.income })),
    expense: dailyTotals.map((day, index) => ({ x: index + 1, y: day.expense })),
  };

  // Maksimum değeri bul (y ekseni için)
  const maxValue = Math.max(
    ...dailyTotals.map(day => Math.max(day.income, day.expense))
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gelir/Gider Trendi</Text>

      <View style={styles.chartContainer}>
        <VictoryChart
          width={CHART_WIDTH}
          height={220}
          padding={{ top: 20, bottom: 40, left: 50, right: 30 }}
          domainPadding={{ x: [10, 10], y: [10, 10] }}
        >
          <VictoryAxis
            tickFormat={(tick) => `${tick}`}
            style={{
              axis: { stroke: colors.grey[300] },
              tickLabels: { fontSize: 10, fill: colors.text.secondary },
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(tick) => `₺${Math.round(tick / 1000)}K`}
            style={{
              axis: { stroke: colors.grey[300] },
              tickLabels: { fontSize: 10, fill: colors.text.secondary },
            }}
          />
          <VictoryLine
            data={chartData.income}
            style={{
              data: { stroke: colors.success.main, strokeWidth: 2 },
            }}
            animate={{ duration: 500 }}
          />
          <VictoryLine
            data={chartData.expense}
            style={{
              data: { stroke: colors.error.main, strokeWidth: 2 },
            }}
            animate={{ duration: 500 }}
          />
        </VictoryChart>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.success.main }]} />
            <Text style={styles.legendText}>Gelir</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.error.main }]} />
            <Text style={styles.legendText}>Gider</Text>
          </View>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>En Yüksek Gelir</Text>
          <Text style={[styles.summaryValue, { color: colors.success.main }]}>
            {formatCurrency(Math.max(...dailyTotals.map(day => day.income)))}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>En Yüksek Gider</Text>
          <Text style={[styles.summaryValue, { color: colors.error.main }]}>
            {formatCurrency(Math.max(...dailyTotals.map(day => day.expense)))}
          </Text>
        </View>
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  chartContainer: {
    marginVertical: spacing.sm,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: -spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.grey[200],
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 