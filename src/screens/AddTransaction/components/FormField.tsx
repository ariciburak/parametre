import React from 'react'
import { View, Pressable, Platform, ViewStyle } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors } from '../../../theme'
import { Text } from '../../../components/common/Text'
import type { MaterialCommunityIcons as MCIcon } from '@expo/vector-icons'
import { styles } from './FormField.styles'

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