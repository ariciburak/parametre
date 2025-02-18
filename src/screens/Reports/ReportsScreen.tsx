import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import useTransactionStore from '../../store/useTransactionStore';
import { spacing, colors } from '../../theme';
import { PeriodSelector } from './components/PeriodSelector';
import { ExpenseOverview } from './components/ExpenseOverview';
import { TrendChart } from './components/TrendChart';
import { CategoryComparison } from './components/CategoryComparison';
import { SpendingChart } from './components/SpendingChart';
import { Text } from '../../components/common/Text';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const ReportsScreen = () => {
  const { transactions } = useTransactionStore();
  const [selectedPeriod, setSelectedPeriod] = React.useState(() => {
    const now = new Date();
    return {
      month: now.getMonth(),
      year: now.getFullYear(),
    };
  });

  // Seçili dönemdeki işlemleri filtrele
  const periodTransactions = React.useMemo(() => {
    return transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return (
        date.getMonth() === selectedPeriod.month &&
        date.getFullYear() === selectedPeriod.year
      );
    });
  }, [transactions, selectedPeriod]);

  // Son 7 günün verilerini hazırla
  const last7DaysData = React.useMemo(() => {
    // Bugünü merkez alarak 3 gün öncesi ve 3 gün sonrasını oluştur
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + (i - 3)); // 3 gün önceden 3 gün sonraya
      return date;
    });

    // Her gün için gelir ve giderleri hesapla
    return dates.map((date) => {
      // O güne ait işlemleri filtrele
      const dayTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getDate() === date.getDate() &&
          transactionDate.getMonth() === date.getMonth() &&
          transactionDate.getFullYear() === date.getFullYear()
        );
      });

      // Günlük gelir ve giderleri hesapla
      const income = dayTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = dayTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      // Gün ve ayı al (örn: "12.04")
      const dayMonth = `${date.getDate().toString().padStart(2, "0")}.${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`;

      return {
        date: dayMonth,
        income,
        expense,
      };
    });
  }, [transactions]);

  // Toplam işlem sayısı
  const transactionCount = periodTransactions.length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Raporlar</Text>
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

          {transactionCount === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="chart-box-outline"
                size={64}
                color={colors.grey[300]}
              />
              <Text style={styles.emptyTitle}>Henüz İşlem Yok</Text>
              <Text style={styles.emptyText}>
                Bu dönem için henüz hiç işlem bulunmuyor.
                İşlemlerinizi ekledikçe burada detaylı raporlar göreceksiniz.
              </Text>
            </View>
          ) : (
            <>
              {/* Harcama Özeti */}
              <View style={styles.section}>
                <ExpenseOverview
                  transactions={transactions}
                  period={selectedPeriod}
                />
              </View>

              {/* Günlük Gelir/Gider Grafiği */}
              <View style={styles.section}>
                <SpendingChart data={last7DaysData} />
              </View>

              {/* Trend Grafiği */}
              <View style={styles.section}>
                <TrendChart
                  transactions={transactions}
                  period={selectedPeriod}
                />
              </View>

              {/* Kategori Karşılaştırması */}
              <View style={styles.section}>
                <CategoryComparison
                  transactions={transactions}
                  period={selectedPeriod}
                />
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.main,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: spacing.screen.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    height: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.common.white,
  },
  content: {
    flex: 1,
    backgroundColor: colors.grey[100],
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: spacing.lg,
    padding: spacing.screen.sm,
    paddingBottom: spacing.screen.sm * 2,
  },
  section: {
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl * 2,
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
}); 