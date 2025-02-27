import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text } from '../../components/common/Text'
import { Button } from '../../components/common/Button'
import { colors, spacing } from '../../theme'
import useBudgetStore from '../../store/useBudgetStore'
import { formatCurrency } from '../../utils/currency'
import { getCategoryById } from '../../constants/categories'
import type { BudgetWithCategory } from '../../types/budget'

interface BudgetDetailScreenProps {
  budget: BudgetWithCategory | null
  onClose: () => void
  onSuccess: () => void
}

export const BudgetDetailScreen = ({ budget, onClose, onSuccess }: BudgetDetailScreenProps) => {
  if (!budget) return null

  const [amount, setAmount] = useState(budget.amount.toString())
  const [loading, setLoading] = useState(false)
  const updateBudget = useBudgetStore(state => state.updateBudget)
  const deleteBudget = useBudgetStore(state => state.deleteBudget)

  const category = getCategoryById(budget.categoryId)
  if (!category) return null

  const handleAmountChange = (value: string) => {
    // Sadece sayısal değerlere izin ver
    const numericValue = value.replace(/[^0-9]/g, '')
    setAmount(numericValue)
  }

  const handleSave = () => {
    if (!amount) return

    setLoading(true)
    updateBudget(budget.id, {
      amount: Number(amount),
    })
      .then(() => {
        onSuccess()
      })
      .catch((error) => {
        Alert.alert('Hata', 'Bütçe güncellenirken bir hata oluştu.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleDelete = () => {
    Alert.alert(
      'Bütçeyi Sil',
      'Bu bütçeyi silmek istediğinize emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            setLoading(true)
            deleteBudget(budget.id)
              .then(() => {
                onSuccess()
              })
              .catch((error) => {
                Alert.alert('Hata', 'Bütçe silinirken bir hata oluştu.')
              })
              .finally(() => {
                setLoading(false)
              })
          },
        },
      ],
      { cancelable: true }
    )
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return colors.error.main
    if (percentage >= 70) return colors.warning.main
    return colors.success.main
  }

  const percentage = (budget.spent / Number(amount)) * 100
  const progressColor = getProgressColor(percentage)

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
              <MaterialCommunityIcons
                name={category.icon}
                size={24}
                color={colors.common.white}
              />
            </View>
            <View style={styles.headerContent}>
              <Text style={styles.category}>{category.label}</Text>
              <Text style={styles.month}>
                {new Date(budget.month + '-01').toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                })}
              </Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Hedef Bütçe</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="currency-try"
                  size={20}
                  color={colors.text.secondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={amount}
                  onChangeText={handleAmountChange}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.text.secondary}
                />
              </View>
            </View>

            {/* Harcama Durumu */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Harcama Durumu</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Harcanan</Text>
                  <Text style={[styles.statValue, { color: colors.error.main }]}>
                    {formatCurrency(budget.spent)}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Kalan</Text>
                  <Text style={[styles.statValue, { color: colors.success.main }]}>
                    {formatCurrency(Number(amount) - budget.spent)}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Kullanım</Text>
                  <Text style={[styles.statValue, { color: progressColor }]}>
                    %{percentage.toFixed(1)}
                  </Text>
                </View>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: progressColor,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.percentage, { 
                  color: progressColor
                }]}>
                  %{percentage.toFixed(1)} kullanıldı
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          variant="primary"
          size="large"
          loading={loading}
          onPress={handleSave}
          fullWidth
          style={styles.saveButton}
        >
          Kaydet
        </Button>

        <Button
          variant="primary"
          size="large"
          loading={loading}
          onPress={handleDelete}
          fullWidth
          style={styles.deleteButton}
        >
          Bütçeyi Sil
        </Button>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.screen.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    marginLeft: spacing.sm,
  },
  category: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  month: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  form: {
    gap: spacing.lg,
  },
  formGroup: {
    gap: spacing.sm,
  },
  label: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grey[50],
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
  },
  inputIcon: {
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: colors.text.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.grey[50],
    borderRadius: 12,
    padding: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.grey[100],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
  },
  footer: {
    padding: spacing.screen.sm,
    paddingBottom: Platform.OS === 'ios' ? 34 : spacing.screen.sm,
    backgroundColor: colors.common.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    gap: spacing.sm,
  },
  saveButton: {
    backgroundColor: colors.primary.main,
  },
  deleteButton: {
    backgroundColor: colors.error.main,
  },
}) 