import React from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text } from '../../../components/common/Text'
import { colors, spacing } from '../../../theme'
import { Transaction } from '../../../types/transaction'
import { formatCurrency } from '../../../utils/currency'
import { categories } from '../../../constants/categories'

interface CategorySummaryProps {
  transactions: Transaction[]
}

export const CategorySummary = ({ transactions }: CategorySummaryProps) => {
  // Kategori bazlı toplam harcamaları hesapla
  const categorySummary = React.useMemo(() => {
    const summary = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'expense') {
        if (!acc[transaction.categoryId]) {
          acc[transaction.categoryId] = 0
        }
        acc[transaction.categoryId] += transaction.amount
      }
      return acc
    }, {} as Record<string, number>)

    // Toplam harcama
    const totalExpense = Object.values(summary).reduce((sum, amount) => sum + amount, 0)

    // Kategorileri harcama miktarına göre sırala
    return Object.entries(summary)
      .map(([categoryId, amount]) => ({
        category: categories.find(c => c.id === categoryId),
        amount,
        percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4) // En çok harcama yapılan 4 kategori
  }, [transactions])

  if (categorySummary.length === 0) return null

  return (
    <View style={styles.container}>
      <Text variant="h3" style={styles.title}>Harcama Kategorileri</Text>

      <View style={styles.categoryList}>
        {categorySummary.map(({ category, amount, percentage }) => {
          if (!category) return null

          return (
            <View key={category.id} style={styles.categoryItem}>
              <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
                <MaterialCommunityIcons
                  name={category.icon}
                  size={20}
                  color={colors.common.white}
                />
              </View>

              <View style={styles.categoryInfo}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{category.label}</Text>
                  <Text style={styles.amount}>{formatCurrency(amount)}</Text>
                </View>

                <View style={styles.progressContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { 
                        backgroundColor: category.color + '20',
                        width: '100%'
                      }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: category.color,
                        width: `${percentage}%`
                      }
                    ]}
                  />
                </View>
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.common.white,
    borderRadius: 16,
    padding: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: colors.grey[900],
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  title: {
    fontSize: 18,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  categoryList: {
    gap: spacing.md,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.grey[900],
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  categoryInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  progressContainer: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
  },
}) 