import React, { useState } from 'react'
import { View, Platform, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Keyboard, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { colors } from '../../theme'
import { Text } from '../../components/common/Text'
import { Button } from '../../components/common/Button'
import { TransactionTypeSelector } from './components/TransactionTypeSelector'
import { AmountInput } from './components/AmountInput'
import { CategoryModal } from './components/CategoryModal'
import { PhotoUploadField } from './components/PhotoUploadField'
import { DatePickerField } from './components/DatePickerField'
import { FormField } from './components/FormField'
import useTransactionStore from '../../store/useTransactionStore'
import type { TransactionType } from '../../constants/transactions'
import type { TransactionFormValues } from '../../types/transaction'
import { getCategoryById } from '../../constants/categories'
import { styles } from './AddTransactionScreen.styles'

const initialFormValues: TransactionFormValues = {
  type: 'income',
  amount: '',
  categoryId: '',
  date: new Date(),
  description: '',
  photo: undefined,
  photoDescription: '',
}

export const AddTransactionScreen = () => {
  const navigation = useNavigation()
  const addTransaction = useTransactionStore(state => state.addTransaction)
  const [loading, setLoading] = useState(false)
  const [formValues, setFormValues] = useState<TransactionFormValues>(initialFormValues)

  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  const keyboardButtonAnimation = React.useRef(new Animated.Value(0)).current

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
    try {
      setLoading(true)
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
      addTransaction({
        ...formValues,
        categoryId,
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
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>İşlem Ekle</Text>
      </View>

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
              label="Kategori"
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

            {/* Photo Upload */}
            <PhotoUploadField
              photo={formValues.photo}
              photoDescription={formValues.photoDescription}
              onPhotoChange={(photo) => handleChange('photo', photo)}
              onPhotoDescriptionChange={(description) => handleChange('photoDescription', description)}
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
            fullWidth
            loading={loading}
            onPress={handleSubmit}
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
        onChange={value => {
          handleChange('categoryId', value)
          setShowCategoryModal(false)
        }}
      />
    </SafeAreaView>
  )
} 