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
  
  // Create smooth curve through points
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const controlX = (current.x + next.x) / 2;
    
    path.cubicTo(
      controlX, current.y,
      controlX, next.y,
      next.x, next.y
    );
  }
  
  // Complete the path for gradient fill
  const lastPoint = points[points.length - 1];
  path.lineTo(lastPoint.x, baseline);
  path.lineTo(points[0].x, baseline);
  path.close();
  
  return path;
};

export const SpendingChart = ({ data }: SpendingChartProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const chartWidth = windowWidth - 16;
  const chartHeight = 240;

  const padding = {
    top: 20,
    bottom: 50,
    left: 65,
    right: 8,
  };

  const width = chartWidth - padding.left - padding.right;
  const height = chartHeight - padding.top - padding.bottom;

  // Calculate max values for both income and expense
  const maxIncome = Math.max(...data.map(d => d.income));
  const maxExpense = Math.max(...data.map(d => d.expense));
  const maxValue = Math.max(maxIncome, maxExpense);
  const step = Math.ceil(maxValue / 4 / 500) * 500;
  const yAxisValues = Array.from({ length: 5 }, (_, i) => step * (4 - i));

  const xStep = width / (data.length - 1);
  const yScale = height / (step * 4);

  // Calculate points for both series
  const incomePoints = data.map((point, i) => ({
    x: padding.left + i * xStep,
    y: padding.top + (height - point.income * yScale),
  }));

  const expensePoints = data.map((point, i) => ({
    x: padding.left + i * xStep,
    y: padding.top + (height - point.expense * yScale),
  }));

  // Create smooth paths
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
              color="#4579C5"
            >
              <SkLinearGradient
                start={vec(0, padding.top)}
                end={vec(0, padding.top + height)}
                colors={[
                  "rgba(69, 121, 197, 1)",
                  "rgba(69, 121, 197, 0.9)",
                  "rgba(69, 121, 197, 0.7)",
                  "rgba(69, 121, 197, 0)"
                ]}
              />
            </Path>

            {/* Expense area */}
            <Path
              path={expensePath}
              color="#B64E81"
            >
              <SkLinearGradient
                start={vec(0, padding.top)}
                end={vec(0, padding.top + height)}
                colors={[
                  "rgba(182, 78, 129, 1)",
                  "rgba(182, 78, 129, 0.9)",
                  "rgba(182, 78, 129, 0.7)",
                  "rgba(182, 78, 129, 0)"
                ]}
              />
            </Path>
          </Canvas>

          {/* X axis labels */}
          <View style={defaultStyles.xAxis}>
            {data.map((point, i) => (
              <View
                key={i}
                style={[
                  defaultStyles.xLabelContainer,
                  { left: padding.left + i * xStep - 20 },
                ]}
              >
                <Text style={defaultStyles.xLabel}>{point.date}</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
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
});
