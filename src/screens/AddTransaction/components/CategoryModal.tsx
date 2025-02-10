import React from 'react'
import { View, ScrollView, Pressable } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text } from '../../../components/common/Text'
import { BottomSheet } from '../../../components/common/BottomSheet'
import { getCategoriesByType } from '../../../constants/categories'
import { colors } from '../../../theme'
import type { TransactionType } from '../../../constants/transactions'
import { styles } from './CategoryModal.styles'

type Props = {
  visible: boolean
  onClose: () => void
  type: TransactionType
  value: string
  onChange: (value: string) => void
}

export const CategoryModal = ({ visible, onClose, type, value, onChange }: Props) => {
  const categories = getCategoriesByType(type)

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
    >
      <ScrollView style={styles.container}>
        {categories.map(category => (
          <Pressable
            key={category.id}
            style={({ pressed }) => [
              styles.category,
              value === category.id && styles.categorySelected,
              pressed && styles.pressed,
            ]}
            onPress={() => onChange(category.id)}
          >
            <View 
              style={[
                styles.iconContainer,
                { backgroundColor: category.color },
              ]}
            >
              <MaterialCommunityIcons
                name={category.icon}
                size={24}
                color={colors.common.white}
              />
            </View>
            <Text style={styles.label}>{category.label}</Text>
            {value === category.id && (
              <MaterialCommunityIcons
                name="check"
                size={24}
                color={colors.primary.main}
              />
            )}
          </Pressable>
        ))}
      </ScrollView>
    </BottomSheet>
  )
} 