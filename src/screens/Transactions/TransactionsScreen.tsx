import React from 'react'
import { Container } from '../../components/common/Container'
import { Text } from '../../components/common/Text'
import { TransactionList } from './components/TransactionList'
import { TransactionDetailModal } from './components/TransactionDetailModal'
import useTransactionStore from '../../store/useTransactionStore'
import { colors } from '../../theme'
import type { Transaction } from '../../types/transaction'

export const TransactionsScreen = () => {
  const { transactions } = useTransactionStore()
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction>()
  const [showDetailModal, setShowDetailModal] = React.useState(false)

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setShowDetailModal(true)
  }

  return (
    <Container
      headerProps={{
        title: 'İşlemler',
        rightComponent: (
          <Text 
            variant="body" 
            style={{ color: colors.primary.main }}
            onPress={() => {/* TODO: Filtreleme */}}
          >
            Filtrele
          </Text>
        ),
      }}
    >
      <TransactionList 
        transactions={transactions} 
        onTransactionPress={handleTransactionPress}
      />

      <TransactionDetailModal
        transaction={selectedTransaction}
        visible={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </Container>
  )
} 