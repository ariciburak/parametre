import React from "react";
import { StyleSheet, View, useWindowDimensions, TextStyle } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import {
  Canvas,
  Path,
  LinearGradient as SkLinearGradient,
  vec,
  Circle,
  Skia,
} from "@shopify/react-native-skia";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/spacing";
import { Text } from "../../../components/common/Text";
import { formatCurrency } from "../../../utils/currency";

interface SpendingData {
  date: string;
  income: number;
  expense: number;
}

interface SpendingChartProps {
  data: SpendingData[];
}

const createSmoothPath = (points: { x: number; y: number }[], height: number, baseline: number) => {
  const path = Skia.Path.Make();
  
  if (points.length < 2) return path;
  
  path.moveTo(points[0].x, points[0].y);
  
  // Smooth curve through points
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    
    // Control points for cubic bezier
    const controlX1 = current.x + (next.x - current.x) / 3;
    const controlX2 = current.x + (next.x - current.x) * 2 / 3;
    
    path.cubicTo(
      controlX1, current.y,
      controlX2, next.y,
      next.x, next.y
    );
  }
  
  // Complete the path for gradient fill
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  
  path.lineTo(lastPoint.x, baseline);
  path.lineTo(firstPoint.x, baseline);
  path.close();
  
  return path;
};

export const SpendingChart = ({ data }: SpendingChartProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const chartWidth = windowWidth - 32; // Padding'i arttırdık
  const chartHeight = 240;

  console.log('SpendingChart data:', data);

  // Veri kontrolü
  if (!data || data.length === 0) {
    return (
      <View style={defaultStyles.container}>
        <LinearGradient
          colors={["#5B54E8", "#4F46E5", "#3730A3"]}
          style={defaultStyles.gradientContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 0.4, 1]}
        >
          <Text variant="h3" style={defaultStyles.title}>
            Gelir/Gider Analizi
          </Text>
          <View style={[defaultStyles.chartContainer, { alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ color: colors.white }}>Henüz veri bulunmuyor</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  const padding = {
    top: 20,
    bottom: 50,
    left: 75, // Y ekseni için biraz daha alan
    right: 16,
  };

  const width = chartWidth - padding.left - padding.right;
  const height = chartHeight - padding.top - padding.bottom;

  try {
    // Maksimum değerleri hesapla
    const maxIncome = Math.max(1000, ...data.map(d => d.income));
    const maxExpense = Math.max(1000, ...data.map(d => d.expense));
    const maxValue = Math.max(maxIncome, maxExpense);
    
    // Y ekseni için adım değerini hesapla (500'ün katları olacak şekilde)
    const step = Math.ceil(maxValue / 4 / 500) * 500;
    const yAxisValues = Array.from({ length: 5 }, (_, i) => step * (4 - i));

    const xStep = width / (data.length - 1);
    const xPoints = data.map((_, i) => padding.left + i * xStep);

    // Calculate points for both series
    const incomePoints = data.map((point, i) => ({
      x: xPoints[i],
      y: padding.top + height - (height * point.income / (step * 4)),
    }));

    const expensePoints = data.map((point, i) => ({
      x: xPoints[i],
      y: padding.top + height - (height * point.expense / (step * 4)),
    }));

    console.log('Chart data:', {
      data,
      xPoints,
      incomePoints,
      expensePoints,
      step,
      maxValue
    });

    // Create paths
    const incomePath = createSmoothPath(incomePoints, height, padding.top + height);
    const expensePath = createSmoothPath(expensePoints, height, padding.top + height);

    return (
      <View style={defaultStyles.container}>
        <LinearGradient
          colors={["#5B54E8", "#4F46E5", "#3730A3"]}
          style={defaultStyles.gradientContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 0.4, 1]}
        >
          <Text variant="h3" style={defaultStyles.title}>
            Gelir/Gider Analizi
          </Text>
          <View style={defaultStyles.chartContainer}>
            <View style={defaultStyles.yAxis}>
              {yAxisValues.map((value, i) => (
                <View key={i} style={defaultStyles.yAxisLabelContainer}>
                  <Text style={defaultStyles.axisLabel}>
                    {formatCurrency(value)}
                  </Text>
                </View>
              ))}
            </View>

            <Canvas style={defaultStyles.canvas}>
              {/* Grid lines */}
              {yAxisValues.map((_, i) => {
                const y = padding.top + (height / 4) * i;
                return (
                  <Path
                    key={i}
                    path={`M ${padding.left} ${y} L ${padding.left + width} ${y}`}
                    style="stroke"
                    strokeWidth={1}
                    color="rgba(255, 255, 255, 0.2)"
                  />
                );
              })}

              {/* Income area */}
              <Path
                path={incomePath}
                style="fill"
                color="rgba(69, 121, 197, 0.3)"
              />
              <Path
                path={incomePath}
                style="stroke"
                strokeWidth={3}
                color="rgba(69, 121, 197, 0.8)"
              />

              {/* Expense area */}
              <Path
                path={expensePath}
                style="fill"
                color="rgba(182, 78, 129, 0.3)"
              />
              <Path
                path={expensePath}
                style="stroke"
                strokeWidth={3}
                color="rgba(182, 78, 129, 0.8)"
              />

              {/* Data points */}
              {incomePoints.map((point, i) => data[i].income > 0 && (
                <Circle
                  key={`income-${i}`}
                  cx={point.x}
                  cy={point.y}
                  r={3}
                  color="rgba(69, 121, 197, 1)"
                />
              ))}
              {expensePoints.map((point, i) => data[i].expense > 0 && (
                <Circle
                  key={`expense-${i}`}
                  cx={point.x}
                  cy={point.y}
                  r={3}
                  color="rgba(182, 78, 129, 1)"
                />
              ))}
            </Canvas>

            {/* X axis labels */}
            <View style={defaultStyles.xAxis}>
              {data.map((point, i) => (
                <View
                  key={i}
                  style={[
                    defaultStyles.xLabelContainer,
                    { left: xPoints[i] - 20 },
                  ]}
                >
                  <Text style={defaultStyles.xLabel}>{point.date}</Text>
                </View>
              ))}
            </View>

            {/* Legend */}
            <View style={defaultStyles.legend}>
              <View style={defaultStyles.legendItem}>
                <View style={[defaultStyles.legendDot, { backgroundColor: '#4579C5' }]} />
                <Text style={defaultStyles.legendText}>Gelir</Text>
              </View>
              <View style={defaultStyles.legendItem}>
                <View style={[defaultStyles.legendDot, { backgroundColor: '#B64E81' }]} />
                <Text style={defaultStyles.legendText}>Gider</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  } catch (error) {
    console.error('SpendingChart render error:', error);
    return (
      <View style={defaultStyles.container}>
        <LinearGradient
          colors={["#5B54E8", "#4F46E5", "#3730A3"]}
          style={defaultStyles.gradientContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 0.4, 1]}
        >
          <Text variant="h3" style={defaultStyles.title}>
            Gelir/Gider Analizi
          </Text>
          <View style={[defaultStyles.chartContainer, { alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ color: colors.white }}>Grafik yüklenirken bir hata oluştu</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }
};

const defaultStyles = StyleSheet.create({
  container: {
    borderRadius: spacing.md,
    overflow: 'hidden',
  },
  gradientContainer: {
    padding: spacing.md,
  },
  title: {
    marginBottom: spacing.md,
    color: colors.white,
  },
  chartContainer: {
    position: "relative",
    height: 240,
  },
  canvas: {
    width: "100%",
    height: 240,
  },
  yAxis: {
    position: "absolute",
    left: 0,
    top: 14,
    bottom: 50,
    justifyContent: "space-between",
    width: 60,
    paddingLeft: 8,
    paddingRight: 8,
  },
  yAxisLabelContainer: {
    height: 20,
    justifyContent: "center",
    paddingVertical: 2,
  },
  axisLabel: {
    fontSize: 10,
    color: colors.white,
    opacity: 0.8,
    textAlign: "right",
    includeFontPadding: false,
    textAlignVertical: "center",
    lineHeight: 12,
  },
  xAxis: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
    height: 30,
  },
  xLabelContainer: {
    position: "absolute",
    width: 40,
    alignItems: "center",
    marginTop: 5,
  },
  xLabel: {
    fontSize: 10,
    color: colors.white,
    opacity: 0.8,
    textAlign: "center",
    includeFontPadding: false,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.8,
  },
});
