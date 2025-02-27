import React from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Platform,
  StatusBar,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text } from '../../components/common/Text'
import { colors, spacing } from '../../theme'
import useBudgetStore from '../../store/useBudgetStore'
import { BudgetList } from './components/BudgetList'
import { MonthSelector } from './components/MonthSelector'
import { BudgetSummary } from './components/BudgetSummary'
import { AddBudgetScreen } from './AddBudgetScreen'
import { BottomSheet } from '../../components/common/BottomSheet'
import type { BudgetWithCategory } from '../../types/budget'
import { BudgetDetailScreen } from './BudgetDetailScreen'

export const BudgetScreen = () => {
  const [selectedMonth, setSelectedMonth] = React.useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const [showAddBudget, setShowAddBudget] = React.useState(false)
  const [showBudgetDetail, setShowBudgetDetail] = React.useState(false)
  const [selectedBudget, setSelectedBudget] = React.useState<BudgetWithCategory | null>(null)

  const { getMonthlyBudgetSummary } = useBudgetStore()
  const budgetSummary = getMonthlyBudgetSummary(selectedMonth)

  const handleAddBudget = () => {
    setShowAddBudget(true)
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bütçe Yönetimi</Text>
        <Pressable
          onPress={handleAddBudget}
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.pressed
          ]}
        >
          <MaterialCommunityIcons
            name="plus"
            size={24}
            color={colors.common.white}
          />
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Ay Seçici */}
          <MonthSelector
            value={selectedMonth}
            onChange={setSelectedMonth}
          />

          {/* Bütçe Özeti */}
          <BudgetSummary summary={budgetSummary} />

          {/* Bütçe Listesi */}
          <BudgetList
            budgets={budgetSummary.categories}
            onBudgetPress={(budget: BudgetWithCategory) => {
              setShowBudgetDetail(true)
              setSelectedBudget(budget)
            }}
          />
        </ScrollView>
      </View>

      {/* Add Budget Modal */}
      <BottomSheet
        visible={showAddBudget}
        onClose={() => setShowAddBudget(false)}
        height={600}
      >
        <AddBudgetScreen
          month={selectedMonth}
          onSuccess={() => setShowAddBudget(false)}
        />
      </BottomSheet>

      {/* Budget Detail Modal */}
      <BottomSheet
        visible={showBudgetDetail}
        onClose={() => setShowBudgetDetail(false)}
        height={600}
      >
        <BudgetDetailScreen
          budget={selectedBudget}
          onClose={() => setShowBudgetDetail(false)}
          onSuccess={() => {
            setShowBudgetDetail(false)
          }}
        />
      </BottomSheet>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screen.sm,
    paddingVertical: spacing.md,
    backgroundColor: colors.common.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.screen.xs,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
}) 