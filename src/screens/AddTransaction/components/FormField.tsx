import React from 'react'
import { View, StyleSheet, Pressable, Platform, ViewStyle } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors, spacing } from '../../../theme'
import { Text } from '../../../components/common/Text'
import type { MaterialCommunityIcons as MCIcon } from '@expo/vector-icons'

interface FormFieldProps {
  label: string
  icon?: keyof typeof MCIcon.glyphMap
  iconColor?: string
  onPress?: () => void
  rightContent?: React.ReactNode
  children?: React.ReactNode
  style?: ViewStyle
}

export const FormField = ({
  label,
  icon,
  iconColor = colors.text.secondary,
  onPress,
  rightContent,
  children,
  style,
}: FormFieldProps) => {
  const Container = onPress ? Pressable : View

  return (
    <Container 
      style={[styles.dateField, style]}
      onPress={onPress}
      android_ripple={onPress ? { color: colors.grey[200] } : undefined}
    >
      <View style={styles.fieldContent}>
        <View style={styles.fieldLeft}>
          {icon && (
            <MaterialCommunityIcons 
              name={icon}
              size={22} 
              color={iconColor}
            />
          )}
          <Text style={styles.fieldLabel}>{label}</Text>
        </View>
        <View style={styles.fieldRight}>
          {children || rightContent}
        </View>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
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
  fieldLabel: {
    fontSize: 15,
    color: colors.text.secondary,
    fontWeight: '500',
  },
}) 