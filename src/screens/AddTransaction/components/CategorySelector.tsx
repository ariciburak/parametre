import React from 'react'
import { View, StyleSheet, ScrollView, Pressable } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text } from '../../../components/common/Text'
import { getCategoriesByType } from '../../../constants/categories'
import type { TransactionType } from '../../../constants/transactions'

type Props = {
  type: TransactionType
  value: string
  onChange: (value: string) => void
}

export const CategorySelector = ({ type, value, onChange }: Props) => {
  const categories = getCategoriesByType(type)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kategori</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map(category => (
          <Pressable
            key={category.id}
            style={[
              styles.category,
              { borderColor: category.color },
              value === category.id && { backgroundColor: category.color },
            ]}
            onPress={() => onChange(category.id)}
          >
            <MaterialCommunityIcons
              name={category.icon}
              size={24}
              color={value === category.id ? '#fff' : category.color}
            />
            <Text
              style={[
                styles.label,
                { color: value === category.id ? '#fff' : category.color },
              ]}
            >
              {category.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 4,
    gap: 12,
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
}) 