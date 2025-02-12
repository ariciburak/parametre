import React from 'react'
import { ScrollView } from 'react-native'
import { Container } from '../../components/common/Container'
import { Text } from '../../components/common/Text'
import { BalanceCard } from './components/BalanceCard'
import { SpendingChart } from './components/SpendingChart'
import { spacing } from '../../theme/spacing'

// Örnek veriler
const sampleData = [
  { date: 'Sun', income: 2500, expense: 1000 },
  { date: 'Mon', income: 2800, expense: 3000 },
  { date: 'Tue', income: 2300, expense: 700 },
  { date: 'Wed', income: 2400, expense: 900 },
  { date: 'Thu', income: 3200, expense: 750 },
  { date: 'Fri', income: 2900, expense: 800 },
  { date: 'Sat', income: 2700, expense: 600 },
]

export const HomeScreen = () => {
  return (
    <Container scroll>
      <ScrollView 
        contentContainerStyle={{ gap: spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        <BalanceCard
          balance={5250}
          income={8500}
          expense={3250}
        />
        <SpendingChart data={sampleData} />
      </ScrollView>
    </Container>
  )
} 