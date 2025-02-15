import React from 'react'
import { View, StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Text } from '../../components/common/Text'
import { BalanceCard } from './components/BalanceCard'
import { SpendingChart } from './components/SpendingChart'
import { RecentTransactions } from './components/RecentTransactions'
import { CategorySummary } from './components/CategorySummary'
import { colors, spacing } from '../../theme'
import useTransactionStore from '../../store/useTransactionStore'
import type { Transaction } from '../../types/transaction'

export const HomeScreen = () => {
  const navigation = useNavigation()
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

  const handleSeeAllTransactions = () => {
    navigation.navigate('Transactions' as never)
  }

  const handleTransactionPress = (transaction: Transaction) => {
    // TODO: İşlem detayına git
  }

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

          {/* Harcama Grafiği */}
          <SpendingChart data={last7DaysData} />

          {/* Son İşlemler */}
          <RecentTransactions
            transactions={transactions}
            onSeeAll={handleSeeAllTransactions}
            onTransactionPress={handleTransactionPress}
          />

          {/* Kategori Özeti */}
          <CategorySummary transactions={transactions} />
          <View style={{height: 30}}></View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.main,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screen.sm,
    paddingTop: spacing.md,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
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
    paddingBottom: Platform.OS === 'ios' ? 140 : 120,
  },
}) 