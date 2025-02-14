import React from 'react'
import { ScrollView } from 'react-native'
import { Container } from '../../components/common/Container'
import { Text } from '../../components/common/Text'
import { BalanceCard } from './components/BalanceCard'
import { SpendingChart } from './components/SpendingChart'
import { spacing } from '../../theme/spacing'
import { useTransactionStore } from '../../store/useTransactionStore'

export const HomeScreen = () => {
  const { transactions, totalIncome, totalExpense } = useTransactionStore()

  // Son 7 günün verilerini hazırla
  const last7DaysData = React.useMemo(() => {
    // Bugünü merkez alarak 3 gün öncesi ve 3 gün sonrasını oluştur
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() + (i - 3)) // 3 gün önceden 3 gün sonraya
      return date
    })

    // Her gün için gelir ve giderleri hesapla
    return dates.map(date => {
      // O güne ait işlemleri filtrele
      const dayTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date)
        return (
          transactionDate.getDate() === date.getDate() &&
          transactionDate.getMonth() === date.getMonth() &&
          transactionDate.getFullYear() === date.getFullYear()
        )
      })

      // Günlük gelir ve giderleri hesapla
      const income = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

      const expense = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      // Gün ve ayı al (örn: "12.04")
      const dayMonth = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`

      return {
        date: dayMonth,
        income,
        expense,
      }
    })
  }, [transactions])

  return (
    <Container scroll>
      <ScrollView 
        contentContainerStyle={{ gap: spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        <BalanceCard
          balance={totalIncome - totalExpense}
          income={totalIncome}
          expense={totalExpense}
        />
        <SpendingChart data={last7DaysData} />
      </ScrollView>
    </Container>
  )
} 