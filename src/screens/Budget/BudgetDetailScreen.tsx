import React from 'react'
import {
  View,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text } from '../../components/common/Text'
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
  const { updateBudget, deleteBudget } = useBudgetStore()
  const [amount, setAmount] = React.useState(budget ? budget.amount.toString() : '')
  const [isEditing, setIsEditing] = React.useState(false)

  if (!budget) return null

  const category = getCategoryById(budget.categoryId)
  if (!category) return null

  const handleAmountChange = (value: string) => {
    // Sadece sayı ve virgül girişine izin ver
    const cleanValue = value.replace(/[^0-9,]/g, '')
    
    // Virgül kontrolü
    const parts = cleanValue.split(',')
    if (parts.length > 2) return // Birden fazla virgül varsa işlemi durdur
    
    // Virgülden sonraki kısım için kontrol
    if (parts[1] && parts[1].length > 2) return
    
    setAmount(cleanValue)
  }

  const handleSave = () => {
    const newAmount = Number(amount.replace(',', '.'))
    if (!newAmount || newAmount <= 0) {
      Alert.alert('Uyarı', 'Lütfen geçerli bir tutar giriniz')
      return
    }

    updateBudget(budget.id, {
      amount: newAmount
    })
    onSuccess()
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
            deleteBudget(budget.id)
            onSuccess()
          },
        },
      ]
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
            <MaterialCommunityIcons
              name={category.icon}
              size={32}
              color={colors.common.white}
            />
          </View>
          <View style={styles.headerTexts}>
            <Text style={styles.title}>{category.label}</Text>
            <Text style={styles.subtitle}>{budget.month}</Text>
          </View>
        </View>
        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.pressed,
          ]}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={24}
            color={colors.error.main}
          />
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Bütçe Tutarı */}
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <MaterialCommunityIcons
              name="currency-try"
              size={20}
              color={colors.primary.main}
            />
            <Text style={styles.label}>Aylık Hedef Bütçe</Text>
          </View>
          {isEditing ? (
            <View style={styles.amountContainer}>
              <Text style={styles.currency}>₺</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="0,00"
                keyboardType="decimal-pad"
                placeholderTextColor={colors.text.secondary}
                autoFocus
              />
            </View>
          ) : (
            <Pressable
              style={styles.amountDisplay}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.amountText}>
                {formatCurrency(budget.amount)}
              </Text>
              <MaterialCommunityIcons
                name="pencil"
                size={20}
                color={colors.text.secondary}
              />
            </Pressable>
          )}
        </View>

        {/* Harcama Durumu */}
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <MaterialCommunityIcons
              name="chart-line"
              size={20}
              color={colors.primary.main}
            />
            <Text style={styles.label}>Harcama Durumu</Text>
          </View>
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
                {formatCurrency(budget.amount - budget.spent)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Kullanım</Text>
              <Text style={[styles.statValue, { color: budget.percentage >= 100 ? colors.error.main : colors.primary.main }]}>
                %{budget.percentage.toFixed(1)}
              </Text>
            </View>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(budget.percentage, 100)}%`,
                    backgroundColor: budget.percentage >= 100 ? colors.error.main : colors.primary.main,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      {isEditing && (
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.footerButton,
              styles.cancelButton,
              pressed && styles.pressed,
            ]}
            onPress={() => {
              setIsEditing(false)
              setAmount(budget.amount.toString())
            }}
          >
            <Text style={styles.cancelButtonText}>İptal</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.footerButton,
              styles.saveButton,
              pressed && styles.pressed,
            ]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.screen.sm,
    backgroundColor: colors.common.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headerTexts: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: spacing.screen.sm,
  },
  formGroup: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: spacing.xs,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.grey[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  currency: {
    fontSize: 24,
    fontWeight: '500',
    color: colors.text.primary,
    marginRight: spacing.xs,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    color: colors.text.primary,
    padding: 0,
  },
  amountDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.grey[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  amountText: {
    fontSize: 24,
    fontWeight: '500',
    color: colors.text.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
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
  },
  progressContainer: {
    marginTop: spacing.xs,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.grey[100],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.screen.sm,
    backgroundColor: colors.common.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    gap: spacing.sm,
  },
  footerButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: colors.grey[100],
  },
  saveButton: {
    backgroundColor: colors.primary.main,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.common.white,
  },
  pressed: {
    opacity: 0.7,
  },
}) 