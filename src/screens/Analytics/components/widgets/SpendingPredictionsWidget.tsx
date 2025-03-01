import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../../components/common/Text';
import { colors, spacing } from '../../../../theme';
import { formatCurrency } from '../../../../utils/currency';
import { getCategoryById } from '../../../../constants/categories';
import type { Transaction } from '../../../../types/transaction';

interface SpendingPredictionsWidgetProps {
  transactions: Transaction[];
  period: {
    month: number;
    year: number;
  };
}

interface CategoryPrediction {
  categoryId: string;
  currentSpending: number;
  predictedSpending: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}

export const SpendingPredictionsWidget = ({ transactions, period }: SpendingPredictionsWidgetProps) => {
  const predictions = React.useMemo(() => {
    // Son 3 ayın verilerini analiz et
    const now = new Date();
    const threeMonthsData = new Map<string, number[]>();
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const date = new Date(transaction.date);
        const monthsAgo = (period.year * 12 + period.month) - (date.getFullYear() * 12 + date.getMonth());
        
        // Son 3 ay içindeki işlemleri topla
        if (monthsAgo >= 0 && monthsAgo <= 2) {
          const existing = threeMonthsData.get(transaction.categoryId) || [0, 0, 0];
          existing[monthsAgo] += transaction.amount;
          threeMonthsData.set(transaction.categoryId, existing);
        }
      });

    // Her kategori için tahminleri hesapla
    const categoryPredictions: CategoryPrediction[] = Array.from(threeMonthsData.entries())
      .map(([categoryId, amounts]) => {
        const currentSpending = amounts[0] || 0;
        
        // Basit ağırlıklı ortalama ile tahmin
        const weightedSum = amounts[0] * 0.5 + amounts[1] * 0.3 + amounts[2] * 0.2;
        const predictedSpending = weightedSum;

        // Trend hesapla
        let trend: 'up' | 'down' | 'stable' = 'stable';
        const recentTrend = amounts[0] - amounts[1];
        const previousTrend = amounts[1] - amounts[2];
        
        if (recentTrend > 0 && previousTrend > 0) trend = 'up';
        else if (recentTrend < 0 && previousTrend < 0) trend = 'down';

        // Güven skoru hesapla (0-100)
        const confidence = Math.min(
          100,
          Math.round(
            (amounts.filter(Boolean).length / 3) * 100
          )
        );

        return {
          categoryId,
          currentSpending,
          predictedSpending,
          trend,
          confidence,
        };
      })
      .sort((a, b) => b.predictedSpending - a.predictedSpending)
      .slice(0, 4); // En yüksek 4 kategoriyi göster

    return categoryPredictions;
  }, [transactions, period]);

  const totalCurrentSpending = predictions.reduce((sum, p) => sum + p.currentSpending, 0);
  const totalPredictedSpending = predictions.reduce((sum, p) => sum + p.predictedSpending, 0);
  const overallTrend = totalPredictedSpending > totalCurrentSpending ? 'up' : 'down';

  // Yüzde değişimi hesapla
  const getPercentageChange = () => {
    if (totalCurrentSpending === 0) {
      return totalPredictedSpending > 0 ? 'Yeni harcama bekleniyor' : 'Harcama beklenmiyor';
    }
    return `${Math.abs(Math.round((totalPredictedSpending - totalCurrentSpending) / totalCurrentSpending * 100))}%`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gelecek Ay Tahminleri</Text>

      {/* Genel Tahmin */}
      <View style={styles.overallPrediction}>
        <View style={styles.predictionHeader}>
          <Text style={styles.predictionLabel}>Tahmini Toplam Harcama</Text>
          <MaterialCommunityIcons
            name={overallTrend === 'up' ? 'trending-up' : 'trending-down'}
            size={24}
            color={overallTrend === 'up' ? colors.error.main : colors.success.main}
          />
        </View>
        <Text style={styles.predictionAmount}>
          {formatCurrency(totalPredictedSpending)}
        </Text>
        <Text style={styles.comparisonText}>
          Bu aydan{' '}
          <Text
            style={[
              styles.percentageText,
              { color: overallTrend === 'up' ? colors.error.main : colors.success.main }
            ]}
          >
            {getPercentageChange()}
          </Text>
          {totalCurrentSpending === 0 ? '' : (overallTrend === 'up' ? ' daha fazla' : ' daha az')}
        </Text>
      </View>

      {/* Kategori Tahminleri */}
      <View style={styles.categoriesContainer}>
        {predictions.map(prediction => {
          const category = getCategoryById(prediction.categoryId);
          if (!category) return null;

          return (
            <View key={prediction.categoryId} style={styles.categoryItem}>
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
                <MaterialCommunityIcons
                  name={
                    prediction.trend === 'up'
                      ? 'trending-up'
                      : prediction.trend === 'down'
                      ? 'trending-down'
                      : 'trending-neutral'
                  }
                  size={20}
                  color={
                    prediction.trend === 'up'
                      ? colors.error.main
                      : prediction.trend === 'down'
                      ? colors.success.main
                      : colors.grey[500]
                  }
                />
              </View>
              <View style={styles.predictionDetails}>
                <Text style={styles.predictedAmount}>
                  {formatCurrency(prediction.predictedSpending)}
                </Text>
                <View style={[styles.confidenceBadge, { opacity: prediction.confidence / 100 }]}>
                  <Text style={styles.confidenceText}>
                    {prediction.confidence}% güven
                  </Text>
                </View>
              </View>
            </View>
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  overallPrediction: {
    backgroundColor: colors.grey[50],
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  predictionLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  predictionAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  comparisonText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  percentageText: {
    fontWeight: '600',
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
  predictionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  predictedAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  confidenceBadge: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 12,
    color: colors.common.white,
  },
}); 