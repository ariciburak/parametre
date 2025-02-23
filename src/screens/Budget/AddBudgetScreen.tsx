import React from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text } from '../../components/common/Text'
import { colors, spacing } from '../../theme'
import { BudgetFormValues } from '../../types/budget'
import useBudgetStore from '../../store/useBudgetStore'
import { getCategoriesByType } from '../../constants/categories'
import { CategoryModal } from './components/CategoryModal'
import { formatCurrency } from '../../utils/currency'

interface AddBudgetScreenProps {
  month: string
  onSuccess: () => void
}

export const AddBudgetScreen = ({ month, onSuccess }: AddBudgetScreenProps) => {
  const { addBudget, getBudgetByCategory, updateBudget, deleteBudget } = useBudgetStore()

  const [formValues, setFormValues] = React.useState<BudgetFormValues>({
    month,
    categoryId: '',
    amount: '',
  })

  const [showCategoryModal, setShowCategoryModal] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const selectedCategory = formValues.categoryId
    ? getCategoriesByType('expense').find(c => c.id === formValues.categoryId)
    : null

  // Seçilen ay için formatlı gösterim
  const formattedMonth = React.useMemo(() => {
    const [year, month] = formValues.month.split('-')
    const date = new Date(Number(year), Number(month) - 1)
    return date.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
  }, [formValues.month])

  const handleAmountChange = (value: string) => {
    // Sadece sayı ve virgül girişine izin ver
    const cleanValue = value.replace(/[^0-9,]/g, '')
    
    // Virgül kontrolü
    const parts = cleanValue.split(',')
    if (parts.length > 2) return // Birden fazla virgül varsa işlemi durdur
    
    // Virgülden sonraki kısım için kontrol
    if (parts[1] && parts[1].length > 2) return
    
    setFormValues(prev => ({
      ...prev,
      amount: cleanValue
    }))
  }

  const handleSubmit = async () => {
    try {
      if (!formValues.amount || formValues.amount === '0') {
        Alert.alert('Uyarı', 'Lütfen bir tutar giriniz')
        return
      }

      if (!formValues.categoryId) {
        Alert.alert('Uyarı', 'Lütfen bir kategori seçiniz')
        return
      }

      const amount = Number(formValues.amount.replace(',', '.'))

      // Seçilen kategori için zaten bütçe var mı kontrol et
      const existingBudget = getBudgetByCategory(formValues.categoryId, formValues.month)
      if (existingBudget) {
        Alert.alert(
          'Bütçe Zaten Var',
          `${selectedCategory?.label} kategorisi için ${formattedMonth} döneminde ${formatCurrency(existingBudget.amount)} tutarında bütçe bulunmaktadır. Ne yapmak istersiniz?`,
          [
            {
              text: 'İptal',
              style: 'cancel',
            },
            {
              text: 'Güncelle',
              onPress: () => {
                setLoading(true)
                updateBudget(existingBudget.id, {
                  amount,
                })
                setLoading(false)
                onSuccess()
              },
            },
            {
              text: 'Sil ve Yeni Oluştur',
              style: 'destructive',
              onPress: () => {
                setLoading(true)
                deleteBudget(existingBudget.id)
                addBudget({
                  ...formValues,
                  amount,
                })
                setLoading(false)
                onSuccess()
              },
            },
          ]
        )
        return
      }

      // Yeni bütçe oluştur
      setLoading(true)
      addBudget({
        ...formValues,
        amount,
      })
      onSuccess()
    } catch (error) {
      console.error('Budget save error:', error)
      Alert.alert('Hata', 'Bütçe kaydedilirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons
            name="wallet-plus"
            size={32}
            color={colors.primary.main}
          />
          <View style={styles.headerTexts}>
            <Text style={styles.title}>Yeni Bütçe Ekle</Text>
            <Text style={styles.subtitle}>{formattedMonth} için bütçe planlaması yapın</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Content */}
        <View style={styles.content}>
          {/* Kategori Seçimi */}
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <MaterialCommunityIcons
                name="shape"
                size={20}
                color={colors.primary.main}
              />
              <Text style={styles.label}>Kategori</Text>
            </View>
            <Text style={styles.helperText}>Bütçe oluşturmak istediğiniz harcama kategorisini seçin</Text>
            <Pressable
              onPress={() => setShowCategoryModal(true)}
              style={({ pressed }) => [
                styles.categoryButton,
                pressed && styles.pressed
              ]}
            >
              {selectedCategory ? (
                <View style={styles.selectedCategory}>
                  <View style={[styles.categoryIcon, { backgroundColor: selectedCategory.color }]}>
                    <MaterialCommunityIcons
                      name={selectedCategory.icon}
                      size={24}
                      color={colors.common.white}
                    />
                  </View>
                  <Text style={styles.categoryName}>{selectedCategory.label}</Text>
                </View>
              ) : (
                <Text style={styles.placeholderText}>Kategori Seç</Text>
              )}
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={colors.text.secondary}
              />
            </Pressable>
          </View>

          {/* Tutar */}
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <MaterialCommunityIcons
                name="currency-try"
                size={20}
                color={colors.primary.main}
              />
              <Text style={styles.label}>Aylık Hedef Bütçe</Text>
            </View>
            <Text style={styles.helperText}>Bu kategori için aylık harcama limitinizi belirleyin</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.currency}>₺</Text>
              <TextInput
                style={styles.amountInput}
                value={formValues.amount}
                onChangeText={handleAmountChange}
                placeholder="0,00"
                keyboardType="decimal-pad"
                placeholderTextColor={colors.text.secondary}
              />
            </View>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <MaterialCommunityIcons
              name="information"
              size={20}
              color={colors.primary.main}
            />
            <Text style={styles.infoText}>
              Belirlediğiniz bütçe limiti, harcamalarınızı takip etmenize ve finansal hedeflerinize ulaşmanıza yardımcı olacaktır.
              {'\n\n'}
              Not: Aynı kategori için zaten bütçe varsa, güncelleyebilir veya silip yeniden oluşturabilirsiniz.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.pressed,
            loading && styles.disabled
          ]}
        >
          <MaterialCommunityIcons
            name="check"
            size={24}
            color={colors.common.white}
            style={styles.submitIcon}
          />
          <Text style={styles.submitButtonText}>
            {loading ? 'Kaydediliyor...' : 'Bütçe Oluştur'}
          </Text>
        </Pressable>
      </View>

      {/* Kategori Modal */}
      <CategoryModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        value={formValues.categoryId}
        onChange={(categoryId) => {
          setFormValues(prev => ({
            ...prev,
            categoryId
          }))
          setShowCategoryModal(false)
        }}
      />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing.screen.sm,
    backgroundColor: colors.common.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    marginBottom: spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTexts: {
    marginLeft: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  content: {
    flex: 1,
    padding: spacing.screen.sm,
  },
  formGroup: {
    marginBottom: spacing.xl,
    backgroundColor: colors.common.white,
    borderRadius: 16,
    padding: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: colors.common.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: spacing.xs,
  },
  helperText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.grey[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  categoryName: {
    fontSize: 16,
    color: colors.text.primary,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.text.secondary,
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
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.primary.main + '10',
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  footer: {
    padding: spacing.screen.sm,
    backgroundColor: colors.common.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  submitButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitIcon: {
    marginRight: spacing.xs,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.common.white,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
}) 