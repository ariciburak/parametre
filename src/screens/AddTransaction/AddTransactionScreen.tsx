import React, { useState, useEffect } from 'react'
import { View, Platform, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Keyboard, Animated, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { colors, spacing } from '../../theme'
import { Text } from '../../components/common/Text'
import { Button } from '../../components/common/Button'
import { TransactionTypeSelector } from './components/TransactionTypeSelector'
import { AmountInput } from './components/AmountInput'
import { CategoryModal } from './components/CategoryModal'
import { DatePickerField } from './components/DatePickerField'
import { FormField } from './components/FormField'
import useTransactionStore from '../../store/useTransactionStore'
import type { TransactionType } from '../../constants/transactions'
import type { TransactionFormValues } from '../../types/transaction'
import { getCategoryById } from '../../constants/categories'
import { useAnalytics } from '../../hooks/useAnalytics'

const initialFormValues: TransactionFormValues = {
  type: 'income',
  amount: '',
  categoryId: '',
  date: new Date(),
  description: '',
}

export const AddTransactionScreen = () => {
  const navigation = useNavigation()
  const { logScreenView, logTransaction } = useAnalytics()
  const addTransaction = useTransactionStore(state => state.addTransaction)
  const [loading, setLoading] = useState(false)
  const [formValues, setFormValues] = useState<TransactionFormValues>(initialFormValues)

  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  const keyboardButtonAnimation = React.useRef(new Animated.Value(0)).current

  useEffect(() => {
    logScreenView('AddTransaction', 'AddTransactionScreen')
  }, [])

  React.useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true)
        Animated.spring(keyboardButtonAnimation, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }).start()
      }
    )
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false)
        Animated.spring(keyboardButtonAnimation, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }).start()
      }
    )

    return () => {
      keyboardWillShow.remove()
      keyboardWillHide.remove()
    }
  }, [])

  const handleChange = (field: keyof TransactionFormValues, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Form validasyonu
      if (!formValues.amount || formValues.amount === '0') {
        // TODO: Hata gösterimi eklenecek
        alert('Lütfen bir tutar giriniz')
        setLoading(false)
        return
      }

      // Eğer kategori seçilmemişse, "Diğer" kategorisini seç
      const otherCategoryId = formValues.type === 'income' ? 'other_income' : 'other_expense'
      const categoryId = formValues.categoryId || otherCategoryId

      // İşlemi kaydet
      await addTransaction({
        ...formValues,
        categoryId,
        amount: formValues.amount,
      })

      // Analytics'e kaydet
      logTransaction({
        id: formValues.type + '_' + Date.now(),
        type: formValues.type,
        amount: parseFloat(formValues.amount.replace(/\./g, '').replace(/,/g, '.')),
        categoryId: categoryId,
      })

      // Form değerlerini sıfırla
      setFormValues(initialFormValues)

      // Ana sayfaya dön
      navigation.goBack()
    } catch (error) {
      console.error('Transaction save error:', error)
      alert('İşlem kaydedilirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Content */}
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.card}>
            {/* Transaction Type */}
            <TransactionTypeSelector
              value={formValues.type}
              onChange={(value: TransactionType) => {
                handleChange('type', value)
                handleChange('categoryId', '')
              }}
            />

            {/* Date Selection */}
            <DatePickerField
              value={formValues.date}
              onChange={(date) => handleChange('date', date)}
            />

            {/* Amount Input */}
            <FormField
              label="Tutar"
              icon="currency-try"
            >
              <AmountInput
                value={formValues.amount}
                type={formValues.type}
                onChange={value => handleChange('amount', value)}
              />
            </FormField>

            {/* Category Selection */}
            <FormField
              label={formValues.categoryId ? (getCategoryById(formValues.categoryId)?.label || "Kategori") : "Kategori"}
              icon={formValues.categoryId ? getCategoryById(formValues.categoryId)?.icon : 'shape-outline'}
              iconColor={formValues.categoryId ? getCategoryById(formValues.categoryId)?.color : colors.text.secondary}
              onPress={() => setShowCategoryModal(true)}
              rightContent={
                formValues.categoryId ? (
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation()
                      handleChange('categoryId', '')
                    }}
                    hitSlop={8}
                  >
                    <MaterialCommunityIcons 
                      name="close" 
                      size={20} 
                      color={colors.text.secondary} 
                    />
                  </Pressable>
                ) : (
                  <MaterialCommunityIcons 
                    name="chevron-down" 
                    size={20} 
                    color={colors.text.secondary} 
                  />
                )
              }
            />

            {/* Note Input */}
            <FormField
              label="Not"
              icon="note-outline"
            >
              <TextInput
                style={styles.input}
                value={formValues.description}
                onChangeText={value => handleChange('description', value)}
                placeholder="Not ekle"
                placeholderTextColor={colors.grey[500]}
              />
            </FormField>
          </View>
        </ScrollView>

        {/* Keyboard Dismiss Button */}
        <Animated.View
          style={[
            styles.keyboardDismissButton,
            {
              transform: [
                {
                  translateY: keyboardButtonAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  }),
                },
              ],
              opacity: keyboardButtonAnimation,
            },
          ]}
        >
          <Pressable
            onPress={() => Keyboard.dismiss()}
            style={({ pressed }) => [
              styles.dismissButton,
              pressed && styles.dismissButtonPressed,
            ]}
          >
            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color={colors.text.secondary}
            />
          </Pressable>
        </Animated.View>

        {/* Save Button */}
        <View style={styles.footer}>
          <Button
            variant="primary"
            size="large"
            loading={loading}
            onPress={handleSubmit}
            fullWidth
          >
            Kaydet
          </Button>
        </View>
      </KeyboardAvoidingView>

      {/* Category Modal */}
      <CategoryModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        type={formValues.type}
        value={formValues.categoryId}
        onChange={(value) => {
          handleChange('categoryId', value)
          setShowCategoryModal(false)
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.common.white,
  },
  content: {
    flex: 1,
    backgroundColor: colors.common.white,

  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 180 : 230,
  },
  card: {
    padding: spacing.screen.sm,
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
    padding: 0,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 80 : 70,
    left: 0,
    right: 0,
    backgroundColor: colors.common.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    padding: spacing.screen.sm,
    paddingBottom: spacing.md,
    zIndex: 1000,
    elevation: 1000,
  },
  keyboardDismissButton: {
    position: 'absolute',
    right: spacing.md,
    bottom: Platform.OS === 'ios' ? 180 : 150,
    zIndex: 1001,
    elevation: 1001,
  },
  dismissButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.common.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.common.black,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  dismissButtonPressed: {
    opacity: 0.7,
  },
}) 