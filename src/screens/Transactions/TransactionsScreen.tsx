import React from "react";
import { View, StyleSheet, SafeAreaView, Platform } from "react-native";
import { Text } from "../../components/common/Text";
import { TransactionList } from "./components/TransactionList";
import { TransactionDetailModal } from "./components/TransactionDetailModal";
import useTransactionStore from "../../store/useTransactionStore";
import { colors, spacing } from "../../theme";
import type { Transaction } from "../../types/transaction";

export const TransactionsScreen = () => {
  const { transactions } = useTransactionStore();
  const [selectedTransaction, setSelectedTransaction] =
    React.useState<Transaction>();
  const [showDetailModal, setShowDetailModal] = React.useState(false);

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>İşlemler</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <TransactionList
          transactions={transactions}
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
});
