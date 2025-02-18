import React from 'react';
import { View, StyleSheet, Platform, Dimensions, Pressable } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryArea, VictoryScatter, VictoryTooltip } from 'victory-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/common/Text';
import { colors, spacing } from '../../../theme';
import { Transaction } from '../../../types/transaction';
import { formatCurrency } from '../../../utils/currency';

interface TrendChartProps {
  transactions: Transaction[];
  period: {
    month: number;
    year: number;
  };
}

interface DailyData {
  day: number;
  income: number;
  expense: number;
  date: Date;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - spacing.screen.sm * 2;
const CHART_HEIGHT = 220;

export const TrendChart = ({ transactions, period }: TrendChartProps) => {
  const [selectedPoint, setSelectedPoint] = React.useState<DailyData | null>(null);

  const chartData = React.useMemo(() => {
    // Seçili aydaki gün sayısını bul
    const daysInMonth = new Date(period.year, period.month + 1, 0).getDate();
    
    // Her gün için boş veri oluştur
    const dailyData: DailyData[] = Array.from({ length: daysInMonth }, (_, index) => ({
      day: index + 1,
      income: 0,
      expense: 0,
      date: new Date(period.year, period.month, index + 1),
    }));

    // İşlemleri günlere dağıt
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      if (date.getMonth() === period.month && date.getFullYear() === period.year) {
        const day = date.getDate();
        if (transaction.type === 'income') {
          dailyData[day - 1].income += transaction.amount;
        } else {
          dailyData[day - 1].expense += transaction.amount;
        }
      }
    });

    return dailyData;
  }, [transactions, period]);

  const maxValue = Math.max(
    ...chartData.map(d => Math.max(d.income, d.expense))
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      weekday: 'short',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Günlük Trend</Text>
        {selectedPoint && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipDate}>
              {formatDate(selectedPoint.date)}
            </Text>
            <View style={styles.tooltipContent}>
              <View style={styles.tooltipItem}>
                <MaterialCommunityIcons
                  name="arrow-down"
                  size={16}
                  color={colors.success.main}
                />
                <Text style={[styles.tooltipValue, { color: colors.success.main }]}>
                  {formatCurrency(selectedPoint.income)}
                </Text>
              </View>
              <View style={styles.tooltipItem}>
                <MaterialCommunityIcons
                  name="arrow-up"
                  size={16}
                  color={colors.error.main}
                />
                <Text style={[styles.tooltipValue, { color: colors.error.main }]}>
                  {formatCurrency(selectedPoint.expense)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <VictoryChart
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        padding={{ top: 20, bottom: 40, left: 60, right: 20 }}
        domainPadding={{ y: [20, 20] }}
      >
        <VictoryAxis
          tickFormat={(tick) => `${tick}`}
          style={{
            axis: { stroke: colors.border.light },
            tickLabels: {
              fill: colors.text.secondary,
              fontSize: 10,
            },
          }}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(tick) => formatCurrency(tick).split(',')[0]}
          style={{
            axis: { stroke: colors.border.light },
            tickLabels: {
              fill: colors.text.secondary,
              fontSize: 10,
            },
          }}
        />

        {/* Gelir Çizgisi */}
        <VictoryLine
          data={chartData}
          x="day"
          y="income"
          style={{
            data: {
              stroke: colors.success.main,
              strokeWidth: 2,
            },
          }}
        />

        {/* Gider Çizgisi */}
        <VictoryLine
          data={chartData}
          x="day"
          y="expense"
          style={{
            data: {
              stroke: colors.error.main,
              strokeWidth: 2,
            },
          }}
        />

        {/* Gelir Noktaları */}
        <VictoryScatter
          data={chartData}
          x="day"
          y="income"
          size={({ datum }) => datum.income > 0 ? 4 : 0}
          style={{
            data: {
              fill: colors.success.main,
              stroke: colors.common.white,
              strokeWidth: 1,
            },
          }}
          events={[{
            target: "data",
            eventHandlers: {
              onPress: () => ({
                target: "data",
                mutation: (props) => {
                  setSelectedPoint(props.datum);
                  return null;
                }
              })
            }
          }]}
        />

        {/* Gider Noktaları */}
        <VictoryScatter
          data={chartData}
          x="day"
          y="expense"
          size={({ datum }) => datum.expense > 0 ? 4 : 0}
          style={{
            data: {
              fill: colors.error.main,
              stroke: colors.common.white,
              strokeWidth: 1,
            },
          }}
          events={[{
            target: "data",
            eventHandlers: {
              onPress: () => ({
                target: "data",
                mutation: (props) => {
                  setSelectedPoint(props.datum);
                  return null;
                }
              })
            }
          }]}
        />
      </VictoryChart>

      <View style={styles.legend}>
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
  },
  tooltipDate: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  tooltipContent: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  tooltipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tooltipValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
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
}); 