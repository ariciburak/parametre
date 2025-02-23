import React from 'react'
import { View, StyleSheet, Pressable, FlatList } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text } from '../../../components/common/Text'
import { colors, spacing } from '../../../theme'
import { getCategoriesByType } from '../../../constants/categories'
import { BottomSheet } from '../../../components/common/BottomSheet'

interface CategoryModalProps {
  visible: boolean
  onClose: () => void
  value: string
  onChange: (categoryId: string) => void
}

const NUM_COLUMNS = 3
const ITEM_MARGIN = 8

export const CategoryModal = ({
  visible,
  onClose,
  value,
  onChange,
}: CategoryModalProps) => {
  const categories = getCategoriesByType('expense')

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Kategori Seç"
      height={500}
    >
      <FlatList
        data={categories}
        renderItem={({ item: category }) => (
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
                value === category.id && styles.iconContainerSelected,
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
                value === category.id && styles.labelSelected,
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
        )}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
      />
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  grid: {
    padding: spacing.md,
  },
  categoryItem: {
    flex: 1,
    margin: ITEM_MARGIN,
    padding: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.common.white,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  categorySelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.main + '10',
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  iconContainerSelected: {
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.text.primary,
  },
  labelSelected: {
    color: colors.primary.main,
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
}) 