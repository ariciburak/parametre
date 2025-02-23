import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text } from "../../components/common/Text";
import { BalanceCard } from "./components/BalanceCard";
import { BudgetCard } from "../../components/home/BudgetCard";
import { QuickTransactionCard } from "./components/QuickTransactionCard";
import { ExpensePieChart } from "./components/ExpensePieChart";
import { RecentTransactions } from "./components/RecentTransactions";
import { CategorySummary } from "./components/CategorySummary";
import { colors, spacing } from "../../theme";
import useTransactionStore from "../../store/useTransactionStore";
import type { Transaction, Period } from "../../types/transaction";

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { transactions } = useTransactionStore();
  const [selectedPeriod, setSelectedPeriod] = React.useState<Period>("monthly");

  // Seçili periyoda göre işlemleri filtrele
  const filteredTransactions = React.useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      transactionDate.setHours(0, 0, 0, 0);

      switch (selectedPeriod) {
        case "daily":
          return transactionDate.getTime() === now.getTime();

        case "weekly": {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          return transactionDate >= weekStart && transactionDate <= now;
        }

        case "monthly": {
          return (
            transactionDate.getMonth() === now.getMonth() &&
            transactionDate.getFullYear() === now.getFullYear()
          );
        }

        case "yearly": {
          return transactionDate.getFullYear() === now.getFullYear();
        }

        default:
          return true;
      }
    });
  }, [transactions, selectedPeriod]);

  // Toplam gelir ve gideri hesapla
  const { totalIncome, totalExpense } = React.useMemo(() => {
    return filteredTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") {
          acc.totalIncome += transaction.amount;
        } else {
          acc.totalExpense += transaction.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 }
    );
  }, [filteredTransactions]);

  const handleSeeAllTransactions = () => {
    navigation.navigate("Transactions" as never);
  };

  const handleTransactionPress = (transaction: Transaction) => {
    // TODO: İşlem detayına git
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Content */}
      <View style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentInner}
        >
          {/* Bakiye Kartı */}
          <BalanceCard
            balance={totalIncome - totalExpense}
            income={totalIncome}
            expense={totalExpense}
            period={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />

          {/* Bütçe Kartı */}
          <BudgetCard />

          {/* Hızlı İşlem Kartı */}
          <QuickTransactionCard />

          {/* Harcama Dağılımı */}
          <ExpensePieChart transactions={filteredTransactions} />

          {/* Son İşlemler */}
          <RecentTransactions
            transactions={filteredTransactions}
            onSeeAll={handleSeeAllTransactions}
            onTransactionPress={handleTransactionPress}
          />

          {/* Kategori Özeti */}
          <CategorySummary transactions={filteredTransactions} />
          <View style={{ height: 30 }}></View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

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
    height: "100%",
    backgroundColor: colors.grey[100],

  },
  scrollView: {
    flex: 1,
  },
  contentInner: {
    gap: spacing.lg,
    padding: spacing.screen.sm,
    paddingBottom: Platform.OS === "ios" ? 140 : 120,
  },
});
