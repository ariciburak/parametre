import React from "react";
import { View, StyleSheet, SafeAreaView, Platform, StatusBar } from "react-native";
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
