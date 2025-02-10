import React, { useState } from 'react'
import { View, StyleSheet, Platform, ScrollView, Pressable, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors, spacing } from '../../theme'
import { Text } from '../../components/common/Text'
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
        <Pressable 
          style={styles.saveButton}
          android_ripple={{ color: colors.primary.dark }}
        >
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </Pressable>
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
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  fieldLabel: {
    fontSize: 15,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  fieldValue: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
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
  saveButton: {
    backgroundColor: colors.primary.main,
    borderRadius: spacing.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary.main,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  saveButtonText: {
    color: colors.common.white,
    fontSize: 16,
    fontWeight: '600',
  },
  dateField: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    ...Platform.select({
      ios: {
        shadowColor: colors.grey[500],
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  fieldContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 20,
    minHeight: 56,
  },
  fieldLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fieldRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    minWidth: 40,
  },
  dateValue: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '500',
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.common.white,
    borderRadius: 16,
    width: '85%',
    padding: spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  modalCloseButton: {
    padding: 4,
  },
  datePicker: {
    height: 200,
  },
  modalButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary.main,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  modalButtonText: {
    color: colors.common.white,
    fontSize: 16,
    fontWeight: '600',
  },
  categoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '500',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 180 : 150,
  },
  photoPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  photoName: {
    fontSize: 15,
    color: colors.text.primary,
    maxWidth: 150,
  },
  photoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  photoOptionText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  photoThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.grey[200],
    left: -8,
  },
  photoInputLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  photoDescriptionInput: {
    fontSize: 15,
    color: colors.text.primary,
    padding: spacing.xs,
    minWidth: 150,
    maxWidth: '70%',
  },
}) 