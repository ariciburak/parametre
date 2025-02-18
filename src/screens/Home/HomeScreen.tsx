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
import { RecentTransactions } from "./components/RecentTransactions";
import { CategorySummary } from "./components/CategorySummary";
import { ExpensePieChart } from "./components/ExpensePieChart";
import { QuickTransactionCard } from "./components/QuickTransactionCard";
import { colors, spacing } from "../../theme";
import useTransactionStore from "../../store/useTransactionStore";
import type { Transaction } from "../../types/transaction";

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { transactions, totalIncome, totalExpense } = useTransactionStore();

  const handleSeeAllTransactions = () => {
    navigation.navigate("Transactions" as never);
  };

  const handleTransactionPress = (transaction: Transaction) => {
    // TODO: İşlem detayına git
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Ana Sayfa</Text>
      </View>

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
          />

          {/* Hızlı İşlem Kartı */}
          <QuickTransactionCard />

          {/* Harcama Dağılımı */}
          <ExpensePieChart transactions={transactions} />

          {/* Son İşlemler */}
          <RecentTransactions
            transactions={transactions}
            onSeeAll={handleSeeAllTransactions}
            onTransactionPress={handleTransactionPress}
          />

          <View style={{ height: 30 }}></View>
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.screen.sm,
    paddingTop: spacing.md,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: colors.common.white,
    marginBottom: spacing.xl,
  },
  content: {
    height: "100%",
    backgroundColor: colors.grey[100],
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -20,
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
