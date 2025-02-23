import React from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text } from '../../../components/common/Text'
import { colors, spacing } from '../../../theme'

interface MonthSelectorProps {
  value: string // YYYY-MM formatında
  onChange: (month: string) => void
}

export const MonthSelector = ({ value, onChange }: MonthSelectorProps) => {
  const handlePrevMonth = () => {
    const [year, month] = value.split('-').map(Number)
    const prevMonth = month === 1 ? 12 : month - 1
    const prevYear = month === 1 ? year - 1 : year
    onChange(`${prevYear}-${String(prevMonth).padStart(2, '0')}`)
  }

  const handleNextMonth = () => {
    const [year, month] = value.split('-').map(Number)
    const nextMonth = month === 12 ? 1 : month + 1
    const nextYear = month === 12 ? year + 1 : year
    onChange(`${nextYear}-${String(nextMonth).padStart(2, '0')}`)
  }

  const formatMonth = () => {
    const [year, month] = value.split('-')
    const date = new Date(Number(year), Number(month) - 1)
    return date.toLocaleDateString('tr-TR', {
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handlePrevMonth}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressed
        ]}
      >
        <MaterialCommunityIcons
          name="chevron-left"
          size={24}
          color={colors.text.primary}
        />
      </Pressable>

      <View style={styles.monthContainer}>
        <Text style={styles.monthText}>{formatMonth()}</Text>
      </View>

      <Pressable
        onPress={handleNextMonth}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressed
        ]}
      >
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={colors.text.primary}
        />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: spacing.xs,
    marginBottom: spacing.md,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: colors.grey[100],
  },
  monthContainer: {
    paddingHorizontal: spacing.md,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
}) 