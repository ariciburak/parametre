import React, { useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Platform, StatusBar } from "react-native";
import { Text } from "../../components/common/Text";
import { TransactionList } from "./components/TransactionList";
import { TransactionDetailModal } from "./components/TransactionDetailModal";
import { TransactionFilters } from "./components/TransactionFilters";
import useTransactionStore from "../../store/useTransactionStore";
import { colors, spacing } from "../../theme";
import type { Transaction } from "../../types/transaction";
import type { TransactionType } from "../../constants/transactions";
import { categories } from "../../constants/categories";
import type { Category } from "../../types/category";
import { useAnalytics } from "../../hooks/useAnalytics";

interface FilterState {
  type?: TransactionType;
  categoryIds?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  amountRange?: {
    min?: number;
    max?: number;
  };
}

export const TransactionsScreen = () => {
  const { logScreenView, logFilter } = useAnalytics();
  const transactions = useTransactionStore((state) => state.transactions);
  const [selectedTransaction, setSelectedTransaction] =
    React.useState<Transaction>();
  const [showDetailModal, setShowDetailModal] = React.useState(false);
  const [filters, setFilters] = React.useState<FilterState>({});

  useEffect(() => {
    logScreenView('Transactions', 'TransactionsScreen');
  }, []);

  // Mevcut işlemlerdeki benzersiz kategorileri bul
  const uniqueCategories = React.useMemo(() => {
    const categoryIds = new Set(transactions.map(t => t.categoryId));
    return categories.filter((c: Category) => categoryIds.has(c.id));
  }, [transactions]);

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    logFilter({
      type: newFilters.type,
      categoryIds: newFilters.categoryIds,
      dateRange: newFilters.dateRange ? 'custom' : undefined,
    });
  };

  // Filtreleme işlemi
  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((transaction) => {
      // İşlem türü filtresi
      if (filters.type && transaction.type !== filters.type) {
        return false;
      }

      // Kategori filtresi
      if (filters.categoryIds?.length && !filters.categoryIds.includes(transaction.categoryId)) {
        return false;
      }

      // Tarih aralığı filtresi
      if (filters.dateRange) {
        const transactionDate = new Date(transaction.date);
        if (
          transactionDate < filters.dateRange.start ||
          transactionDate > filters.dateRange.end
        ) {
          return false;
        }
      }

      // Tutar aralığı filtresi
      if (filters.amountRange) {
        if (
          (filters.amountRange.min !== undefined && transaction.amount < filters.amountRange.min) ||
          (filters.amountRange.max !== undefined && transaction.amount > filters.amountRange.max)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, filters]);

  return (
    <SafeAreaView style={styles.container}>

      {/* Content */}
      <View style={styles.content}>
        <TransactionFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          availableCategories={uniqueCategories}
        />
        <TransactionList
          transactions={filteredTransactions}
          onTransactionPress={handleTransactionPress}
        />
      </View>

      <TransactionDetailModal
        transaction={selectedTransaction}
        visible={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
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
});
