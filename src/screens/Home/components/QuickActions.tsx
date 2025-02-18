import React from 'react'
import { View, ScrollView, Pressable, StyleSheet, Platform } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Text } from '../../../components/common/Text'
import { colors, spacing } from '../../../theme'
import { getCategoriesByType, Category } from '../../../constants/categories'
import useTransactionStore from '../../../store/useTransactionStore'

export const QuickActions = () => {
  const navigation = useNavigation()
  const { transactions } = useTransactionStore()

  // En sık kullanılan kategorileri bul (son 10 işlemden)
  const frequentCategories = React.useMemo(() => {
    const recentTransactions = transactions.slice(0, 10)
    const categoryCount = recentTransactions.reduce((acc, transaction) => {
      if (!acc[transaction.categoryId]) {
        acc[transaction.categoryId] = 0
      }
      acc[transaction.categoryId]++
      return acc
    }, {} as Record<string, number>)

    // Kategorileri kullanım sıklığına göre sırala
    const sortedCategories = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5) // En sık kullanılan 5 kategori
      .map(([categoryId]) => {
        const category = getCategoriesByType('expense')
          .find(c => c.id === categoryId)
        return category
      })
      .filter((category): category is Category => Boolean(category)) // Type guard ile undefined değerleri filtrele

    return sortedCategories
  }, [transactions])

  const handleCategoryPress = (categoryId: string) => {
    // @ts-ignore - Navigation tipini şimdilik ignore edelim
    navigation.navigate('AddTransaction', {
      screen: 'AddTransactionForm',
      params: {
        preselectedCategory: categoryId,
        type: 'expense'
      }
    })
  }

  if (frequentCategories.length === 0) return null

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hızlı İşlem</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {frequentCategories.map(category => (
          <Pressable
            key={category.id}
            style={({ pressed }) => [
              styles.categoryButton,
              pressed && styles.pressed
            ]}
            onPress={() => handleCategoryPress(category.id)}
          >
            <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
              <MaterialCommunityIcons
                name={category.icon}
                size={24}
                color={colors.common.white}
              />
            </View>
            <Text style={styles.categoryLabel}>{category.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
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
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  scrollContent: {
    paddingVertical: spacing.xs,
    gap: spacing.md,
  },
  categoryButton: {
    alignItems: 'center',
    width: 72,
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    ...Platform.select({
      ios: {
        shadowColor: colors.grey[900],
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  categoryLabel: {
    fontSize: 12,
    color: colors.text.primary,
    textAlign: 'center',
  },
}) 