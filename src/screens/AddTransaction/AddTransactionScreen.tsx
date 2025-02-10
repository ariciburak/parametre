import React, { useState } from 'react'
import { View, StyleSheet, Platform, ScrollView, Pressable, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors, spacing } from '../../theme'
import { Text } from '../../components/common/Text'
import { Button } from '../../components/common/Button'
import { TransactionTypeSelector } from './components/TransactionTypeSelector'
import { AmountInput } from './components/AmountInput'
import { CategoryModal } from './components/CategoryModal'
import { PhotoUploadField } from './components/PhotoUploadField'
import { DatePickerField } from './components/DatePickerField'
import { FormField } from './components/FormField'
import type { TransactionType } from '../../constants/transactions'
import type { TransactionFormValues } from '../../types/transaction'
import { getCategoryById } from '../../constants/categories'

export const AddTransactionScreen = () => {
  const [formValues, setFormValues] = useState<TransactionFormValues>({
    type: 'expense',
    amount: '',
    categoryId: '',
    date: new Date(),
    description: '',
    photo: undefined,
    photoDescription: '',
  })

  const [showCategoryModal, setShowCategoryModal] = useState(false)

  const handleChange = (field: keyof TransactionFormValues, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>İşlem Ekle</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
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
      </View>

      {/* Save Button */}
      <View style={styles.footer}>
        <Button
          variant="primary"
          size="large"
          fullWidth
        >
          Kaydet
        </Button>
      </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.main,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screen.sm,
    paddingTop: spacing.md,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.common.white,
    marginBottom: spacing.xl,
  },
  content: {
    flex: 1,
    backgroundColor: colors.primary.main,
    height: 200,
  },
  scrollView: {
    flex: 1,
    marginTop: -20,
  },
  card: {
    backgroundColor: colors.common.white,
    padding: spacing.screen.sm,
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    minHeight: '100%',
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
    bottom: Platform.OS === 'ios' ? 110 : 80,
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 180 : 150,
  },
}) 