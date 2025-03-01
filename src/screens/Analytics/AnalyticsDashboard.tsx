import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Text } from '../../components/common/Text';
import { colors, spacing } from '../../theme';
import useTransactionStore from '../../store/useTransactionStore';
import { PeriodSelector } from './components/PeriodSelector';
import { FinancialSummaryWidget } from './components/widgets/FinancialSummaryWidget';
import { CategoryDistributionWidget } from './components/widgets/CategoryDistributionWidget';
import { TrendAnalysisWidget } from './components/widgets/TrendAnalysisWidget';
import { SpendingPredictionsWidget } from './components/widgets/SpendingPredictionsWidget';
import { BudgetTrackingWidget } from './components/widgets/BudgetTrackingWidget';

export const AnalyticsDashboard = () => {
  const { transactions } = useTransactionStore();
  const [selectedPeriod, setSelectedPeriod] = React.useState(() => {
    const now = new Date();
    return {
      month: now.getMonth(),
      year: now.getFullYear(),
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Finansal Analiz</Text>
        <Text style={styles.subtitle}>Detaylı İstatistikler</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Dönem Seçici */}
          <PeriodSelector
            period={selectedPeriod}
            onChange={setSelectedPeriod}
          />

          {/* Dashboard içeriği */}
          <View style={styles.dashboardContainer}>
            <FinancialSummaryWidget
              transactions={transactions}
              period={selectedPeriod}
            />
            <CategoryDistributionWidget
              transactions={transactions}
              period={selectedPeriod}
            />
            <BudgetTrackingWidget
              transactions={transactions}
              period={selectedPeriod}
            />
            <SpendingPredictionsWidget
              transactions={transactions}
              period={selectedPeriod}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey[100],
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: colors.grey[100],
    paddingHorizontal: spacing.screen.sm,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.text.secondary,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: spacing.lg,
    padding: spacing.screen.sm,
    paddingBottom: Platform.OS === 'ios' ? 100 : 90,
  },
  dashboardContainer: {
    gap: spacing.md,
  },
}); 