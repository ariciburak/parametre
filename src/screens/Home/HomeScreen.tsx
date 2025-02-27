import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
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
import useBudgetStore from "../../store/useBudgetStore";
import { useAuthStore } from "../../store/useAuthStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Transaction, Period } from "../../types/transaction";
import { BalanceCardSkeleton } from './components/BalanceCardSkeleton';
import { BudgetCardSkeleton } from './components/BudgetCardSkeleton';
import { ExpensePieChartSkeleton } from './components/ExpensePieChartSkeleton';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { transactions, isLoading: isTransactionsLoading } = useTransactionStore();
  const { isLoading: isBudgetsLoading } = useBudgetStore();
  const logout = useAuthStore(state => state.logout);
  const [selectedPeriod, setSelectedPeriod] = React.useState<Period>("monthly");

  const isLoading = isTransactionsLoading || isBudgetsLoading;

  const handleLogout = () => {
    Alert.alert(
      "Çıkış Yap",
      "Çıkış yapmak istediğinize emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel"
        },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: () => logout()
        }
      ],
      { cancelable: true }
    );
  };

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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Ana Sayfa</Text>
            <Text style={styles.subtitle}>Hoş geldiniz</Text>
          </View>
          <TouchableOpacity 
            onPress={handleLogout}
            style={styles.logoutButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.logoutIconContainer}>
              <MaterialCommunityIcons 
                name="exit-to-app" 
                size={22} 
                color={colors.common.white}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentInner}
        >
          {/* Bakiye Kartı */}
          {isLoading ? (
            <BalanceCardSkeleton />
          ) : (
            <BalanceCard
              balance={totalIncome - totalExpense}
              income={totalIncome}
              expense={totalExpense}
              period={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
          )}

          {/* Bütçe Kartı */}
          {isLoading ? (
            <BudgetCardSkeleton />
          ) : (
            <BudgetCard />
          )}

          {/* Hızlı İşlem Kartı */}
          <QuickTransactionCard />

          {/* Harcama Dağılımı */}
          {isLoading ? (
            <ExpensePieChartSkeleton />
          ) : (
            <ExpensePieChart transactions={filteredTransactions} />
          )}

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
    backgroundColor: colors.grey[100],
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: colors.grey[100],
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screen.sm,
    paddingBottom: spacing.md,
  },
  titleWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.text.secondary,
    marginTop: 2,
  },
  logoutButton: {
    marginLeft: spacing.md,
  },
  logoutIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#4B5EAA',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4B5EAA',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
    color: colors.text.secondary,
    fontSize: 16,
  },
});
