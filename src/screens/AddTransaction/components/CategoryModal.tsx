import React from 'react'
import { View, ScrollView, Pressable, FlatList, Dimensions, Platform, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text } from '../../../components/common/Text'
import { BottomSheet } from '../../../components/common/BottomSheet'
import { getCategoriesByType, Category } from '../../../constants/categories'
import { colors } from '../../../theme'
import type { TransactionType } from '../../../constants/transactions'

type Props = {
  visible: boolean
  onClose: () => void
  type: TransactionType
  value: string
  onChange: (value: string) => void
}

const SCREEN_WIDTH = Dimensions.get('window').width
const NUM_COLUMNS = 3
const ITEM_MARGIN = 8
const ITEM_WIDTH = (SCREEN_WIDTH - 48 - (NUM_COLUMNS - 1) * ITEM_MARGIN) / NUM_COLUMNS

export const CategoryModal = ({ visible, onClose, type, value, onChange }: Props) => {
  const categories = getCategoriesByType(type)

  const renderItem = ({ item: category }: { item: Category }) => (
    <Pressable
      style={({ pressed }) => [
        styles.categoryItem,
        value === category.id && styles.categorySelected,
        pressed && styles.pressed,
      ]}
      onPress={() => onChange(category.id)}
    >
      <View 
        style={[
          styles.iconContainer,
          { backgroundColor: category.color },
          value === category.id && styles.iconContainerSelected
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
          styles.label,
          value === category.id ? styles.labelSelected : {}
        ]}
      >
        {category.label}
      </Text>
      {value === category.id && (
        <View style={styles.checkmark}>
          <MaterialCommunityIcons
            name="check-circle"
            size={18}
            color={colors.primary.main}
          />
        </View>
      )}
    </Pressable>
  )

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={`${type === 'income' ? 'Gelir' : 'Gider'} Kategorisi Seç`}
      height={500}
    >
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={NUM_COLUMNS}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
      />
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  grid: {
    padding: 16,
    paddingBottom: 32,
  },
  categoryItem: {
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
  } as ViewStyle,
  categorySelected: {
    backgroundColor: colors.primary.main + '08', // %8 opacity
    borderWidth: 2,
    borderColor: colors.primary.main,
  } as ViewStyle,
  pressed: {
    opacity: 0.7,
  } as ViewStyle,
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
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
  } as ViewStyle,
  iconContainerSelected: {
    transform: [{ scale: 1.1 }],
  } as ViewStyle,
  label: {
    fontSize: 13,
    color: colors.text.primary,
    textAlign: 'center',
    fontWeight: '500',
  } as TextStyle,
  labelSelected: {
    color: colors.primary.main,
    fontWeight: '600',
  } as TextStyle,
  checkmark: {
    position: 'absolute' as const,
    top: 8,
    right: 8,
  } as ViewStyle,
}) 