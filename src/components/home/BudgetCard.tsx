import React from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Text } from '../common/Text'
import { colors, spacing } from '../../theme'
import { formatCurrency } from '../../utils/currency'
import useBudgetStore from '../../store/useBudgetStore'
import { BudgetWithCategory } from '../../types/budget'

export const BudgetCard = () => {
  const navigation = useNavigation()
  const { getMonthlyBudgetSummary } = useBudgetStore()

  // Mevcut ayı al
  const currentMonth = React.useMemo(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }, [])

  const summary = getMonthlyBudgetSummary(currentMonth)

  // Kritik durumda olan bütçeleri filtrele (kullanım oranı %80'in üzerinde olanlar)
  const criticalBudgets = summary.categories.filter(
    budget => budget.percentage >= 80
  ).sort((a, b) => b.percentage - a.percentage) // Yüzdeye göre sırala

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return colors.error.main
    if (percentage >= 80) return colors.warning.main
    return colors.success.main
  }

  const handlePress = () => {
    // @ts-ignore
    navigation.navigate('Budget')
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      onPress={handlePress}
    >
      {/* Başlık */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons
            name="wallet"
            size={24}
            color={colors.primary.main}
          />
          <Text style={styles.title}>Bu Ay Bütçe Durumu</Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={colors.text.secondary}
        />
      </View>

      {/* Özet Bilgiler */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Toplam Bütçe</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(summary.totalBudget)}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Harcanan</Text>
          <Text style={[styles.summaryValue, { color: colors.error.main }]}>
            {formatCurrency(summary.totalSpent)}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Kalan</Text>
          <Text style={[styles.summaryValue, { color: colors.success.main }]}>
            {formatCurrency(summary.totalBudget - summary.totalSpent)}
          </Text>
        </View>
      </View>

      {/* İlerleme Çubuğu */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(summary.percentage, 100)}%`,
                backgroundColor: getStatusColor(summary.percentage),
              },
            ]}
          />
        </View>
        <Text style={[styles.percentage, { color: getStatusColor(summary.percentage) }]}>
          %{summary.percentage.toFixed(1)} kullanıldı
        </Text>
      </View>

      {/* Kritik Kategoriler */}
      {criticalBudgets.length > 0 && (
        <View style={styles.criticalContainer}>
          <Text style={styles.criticalTitle}>Dikkat Edilmesi Gerekenler</Text>
          {criticalBudgets.slice(0, 2).map((budget) => (
            <View key={budget.id} style={styles.criticalItem}>
              <View style={styles.criticalInfo}>
                <View style={[styles.categoryIcon, { backgroundColor: budget.category.color }]}>
                  <MaterialCommunityIcons
                    name={budget.category.icon}
                    size={16}
                    color={colors.common.white}
                  />
                </View>
                <Text style={styles.categoryName}>{budget.category.label}</Text>
              </View>
              <Text style={[styles.criticalPercentage, { color: getStatusColor(budget.percentage) }]}>
                %{budget.percentage.toFixed(1)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.grey[100],
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
  },
  criticalContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingTop: spacing.md,
  },
  criticalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  criticalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    padding: spacing.sm,
    backgroundColor: colors.grey[50],
    borderRadius: 8,
  },
  criticalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  categoryName: {
    fontSize: 14,
    color: colors.text.primary,
  },
  criticalPercentage: {
    fontSize: 14,
    fontWeight: '500',
  },
}) 