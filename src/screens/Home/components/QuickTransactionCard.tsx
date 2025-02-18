import React from 'react'
import { View, StyleSheet, Platform, TextInput, Pressable, Modal, ScrollView, TextStyle, Dimensions, FlatList } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text } from '../../../components/common/Text'
import { colors, spacing } from '../../../theme'
import { getCategoryById, getCategoriesByType, Category } from '../../../constants/categories'
import useTransactionStore from '../../../store/useTransactionStore'
import { formatCurrency } from '../../../utils/currency'
import { TransactionType } from '../../../constants/transactions'
import { BottomSheet } from '../../../components/common/BottomSheet'

export const QuickTransactionCard = () => {
  const [amount, setAmount] = React.useState('')
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>('')
  const [showCategoryModal, setShowCategoryModal] = React.useState(false)
  const [transactionType, setTransactionType] = React.useState<TransactionType>('expense')
  const { addTransaction } = useTransactionStore()

  const selectedCategory = selectedCategoryId ? getCategoryById(selectedCategoryId) : null
  const categories = React.useMemo(() => getCategoriesByType(transactionType), [transactionType])

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

  const handleAddTransaction = () => {
    if (!amount || !selectedCategoryId) return

    const numericAmount = Number(amount.replace(',', '.'))
    if (isNaN(numericAmount) || numericAmount <= 0) return

    addTransaction({
      type: transactionType,
      amount: amount.replace(',', '.'),
      categoryId: selectedCategoryId,
      date: new Date(),
    })

    // Başarılı işlem geri bildirimi
    // TODO: Toast message eklenebilir

    // Formu sıfırla
    setAmount('')
    setSelectedCategoryId('')
  }

  const handleCategorySelect = (category: Category) => {
    setSelectedCategoryId(category.id)
    setShowCategoryModal(false)
  }

  const handleTypeChange = (type: TransactionType) => {
    setTransactionType(type)
    setSelectedCategoryId('') // Kategori seçimini sıfırla
  }

  const renderCategoryModal = () => {
    const SCREEN_WIDTH = Dimensions.get('window').width
    const NUM_COLUMNS = 3
    const ITEM_MARGIN = 8
    const ITEM_WIDTH = (SCREEN_WIDTH - 48 - (NUM_COLUMNS - 1) * ITEM_MARGIN) / NUM_COLUMNS

    return (
      <BottomSheet
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title={`${transactionType === 'income' ? 'Gelir' : 'Gider'} Kategorisi Seç`}
        height={500}
      >
        <FlatList
          data={categories}
          renderItem={({ item: category }) => (
            <Pressable
              style={({ pressed }) => [
                {
                  width: ITEM_WIDTH,
                  aspectRatio: 0.9,
                  margin: ITEM_MARGIN / 2,
                  borderRadius: 16,
                  backgroundColor: colors.common.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 12,
                  position: 'relative',
                  ...Platform.select({
                    ios: {
                      shadowColor: colors.grey[900],
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.08,
                      shadowRadius: 4,
                    },
                    android: {
                      elevation: 3,
                    },
                  }),
                },
                selectedCategoryId === category.id && {
                  backgroundColor: colors.primary.main + '08',
                  borderWidth: 2,
                  borderColor: colors.primary.main,
                },
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => handleCategorySelect(category)}
            >
              <View
                style={[
                  {
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                    backgroundColor: category.color,
                    ...Platform.select({
                      ios: {
                        shadowColor: colors.grey[900],
                        shadowOffset: {
                          width: 0,
                          height: 3,
                        },
                        shadowOpacity: 0.15,
                        shadowRadius: 6,
                      },
                      android: {
                        elevation: 4,
                      },
                    }),
                  },
                  selectedCategoryId === category.id && {
                    transform: [{ scale: 1.1 }],
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={category.icon}
                  size={28}
                  color={colors.common.white}
                />
              </View>
              <Text
                style={[
                  {
                    fontSize: 13,
                    color: colors.text.primary,
                    textAlign: 'center',
                    fontWeight: '500',
                  },
                  selectedCategoryId === category.id && {
                    color: colors.primary.main,
                    fontWeight: '600',
                  },
                ]}
              >
                {category.label}
              </Text>
              {selectedCategoryId === category.id && (
                <View style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                }}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={18}
                    color={colors.primary.main}
                  />
                </View>
              )}
            </Pressable>
          )}
          keyExtractor={item => item.id}
          numColumns={NUM_COLUMNS}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 32,
          }}
        />
      </BottomSheet>
    )
  }

  // Para birimi formatı için
  const formattedAmount = React.useMemo(() => {
    if (!amount) return ''
    return amount
  }, [amount])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hızlı İşlem Ekle</Text>
        <View style={styles.typeSelector}>
          <Pressable
            style={[
              styles.typeButton,
              transactionType === 'expense' && styles.typeButtonActive,
              transactionType === 'expense' && { backgroundColor: colors.error.main + '15' }
            ]}
            onPress={() => handleTypeChange('expense')}
          >
            <MaterialCommunityIcons
              name="arrow-up"
              size={16}
              color={transactionType === 'expense' ? colors.error.main : colors.text.secondary}
            />
            <Text 
              style={[
                styles.typeButtonText,
                { color: transactionType === 'expense' ? colors.error.main : colors.text.secondary }
              ]}
            >
              Gider
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.typeButton,
              transactionType === 'income' && styles.typeButtonActive,
              transactionType === 'income' && { backgroundColor: colors.secondary.main + '15' }
            ]}
            onPress={() => handleTypeChange('income')}
          >
            <MaterialCommunityIcons
              name="arrow-down"
              size={16}
              color={transactionType === 'income' ? colors.secondary.main : colors.text.secondary}
            />
            <Text 
              style={[
                styles.typeButtonText,
                { color: transactionType === 'income' ? colors.secondary.main : colors.text.secondary }
              ]}
            >
              Gelir
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.amountContainer}>
          <TextInput
            style={[
              styles.amountInput,
              { color: transactionType === 'income' ? colors.secondary.main : colors.error.main }
            ]}
            value={formattedAmount}
            onChangeText={handleAmountChange}
            placeholder="0,00"
            placeholderTextColor={colors.grey[400]}
            keyboardType="numeric"
          />
          <Text style={[
            styles.currency,
            { color: transactionType === 'income' ? colors.secondary.main : colors.error.main }
          ]}>₺</Text>
        </View>

        <Pressable
          style={[
            styles.categoryButton,
            selectedCategory && { backgroundColor: selectedCategory.color + '15' }
          ]}
          onPress={() => setShowCategoryModal(true)}
        >
          {selectedCategory ? (
            <>
              <MaterialCommunityIcons
                name={selectedCategory.icon}
                size={20}
                color={selectedCategory.color}
              />
              <Text 
                style={[styles.categoryText, { color: selectedCategory.color }]}
                numberOfLines={1}
              >
                {selectedCategory.label}
              </Text>
            </>
          ) : (
            <>
              <MaterialCommunityIcons
                name="shape-outline"
                size={20}
                color={colors.text.secondary}
              />
              <Text style={styles.categoryText}>Kategori Seç</Text>
            </>
          )}
        </Pressable>

        <Pressable
          style={[
            styles.addButton,
            (!amount || !selectedCategoryId) && styles.addButtonDisabled,
            amount && selectedCategoryId && {
              backgroundColor: transactionType === 'income' ? colors.secondary.main : colors.primary.main
            }
          ]}
          onPress={handleAddTransaction}
          disabled={!amount || !selectedCategoryId}
        >
          <MaterialCommunityIcons
            name="plus"
            size={24}
            color={colors.common.white}
          />
        </Pressable>
      </View>

      {renderCategoryModal()}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 8,
  },
  typeButtonActive: {
    backgroundColor: colors.grey[100],
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  amountContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grey[50],
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    height: 48,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    padding: 0,
  },
  currency: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grey[50],
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    height: 48,
    gap: spacing.xs,
    minWidth: 120,
  },
  categoryText: {
    fontSize: 15,
    color: colors.text.secondary,
    flex: 1,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary.main,
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  addButtonDisabled: {
    backgroundColor: colors.grey[300],
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.common.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  modalCloseButton: {
    padding: 4,
  },
  categoryList: {
    padding: spacing.md,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
    borderRadius: 12,
    marginBottom: spacing.sm,
    backgroundColor: colors.grey[50],
  },
  categorySelected: {
    backgroundColor: colors.primary.main + '10',
  },
  pressed: {
    opacity: 0.7,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  categoryLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
}) 