import React from 'react'
import {
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
  Animated,
  ScrollView,
} from 'react-native'
import { colors, spacing, typography } from '../../theme'
import { Text } from './Text'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { MaterialCommunityIcons as MCIcon } from '@expo/vector-icons'
import { BottomSheet } from './BottomSheet'

export interface SelectOption {
  label: string
  value: string
  icon?: keyof typeof MCIcon.glyphMap
  color?: string
}

export interface SelectProps {
  label?: string
  error?: string
  helper?: string
  placeholder?: string
  options: SelectOption[]
  value?: string
  containerStyle?: ViewStyle
  onSelect?: (value: string) => void
  disabled?: boolean
}

export const Select = ({
  label,
  error,
  helper,
  placeholder = 'Seçiniz',
  options,
  value,
  containerStyle,
  onSelect,
  disabled = false,
}: SelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  const focusAnim = React.useRef(new Animated.Value(0)).current

  const selectedOption = options.find(option => option.value === value)

  const handlePress = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      setIsFocused(!isOpen)
      Animated.timing(focusAnim, {
        toValue: !isOpen ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start()
    }
  }

  const handleSelect = (option: SelectOption) => {
    onSelect?.(option.value)
    setIsOpen(false)
    setIsFocused(false)
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border.main, colors.primary.main],
  })

  const labelStyle: TextStyle = {
    ...styles.label,
    ...(error && { color: colors.error.main }),
    ...(disabled && { color: colors.text.disabled }),
  }

  const containerStyles: ViewStyle = {
    ...styles.container,
    ...(error && { 
      borderColor: colors.error.main,
      borderWidth: 2,
    }),
    ...(disabled && styles.containerDisabled),
    ...(isFocused && !error && { borderColor: colors.primary.main }),
  }

  const helperStyle: TextStyle = {
    ...styles.helperText,
    ...(error && { color: colors.error.main }),
  }

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text variant="body2" style={labelStyle}>
          {label}
        </Text>
      )}

      <Animated.View style={[containerStyles, { borderColor }]}>
        <Pressable 
          style={styles.content}
          onPress={handlePress}
          disabled={disabled}
        >
          {selectedOption?.icon && (
            <View 
              style={[
                styles.selectedIcon,
                selectedOption.color && { backgroundColor: selectedOption.color },
              ]}
            >
              <MaterialCommunityIcons
                name={selectedOption.icon}
                size={16}
                color={colors.common.white}
              />
            </View>
          )}
          <Text 
            style={{
              ...styles.text,
              ...((!selectedOption) && styles.placeholder),
              ...(disabled && styles.textDisabled),
            }}
          >
            {selectedOption?.label || placeholder}
          </Text>
          <MaterialCommunityIcons 
            name={isOpen ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color={disabled ? colors.text.disabled : colors.text.secondary} 
          />
        </Pressable>
      </Animated.View>

      {(error || helper) && (
        <Text variant="caption" style={helperStyle}>
          {error || helper}
        </Text>
      )}

      <BottomSheet
        visible={isOpen}
        onClose={() => {
          setIsOpen(false)
          setIsFocused(false)
          Animated.timing(focusAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start()
        }}
        title={label || 'Seçiniz'}
      >
        <ScrollView>
          {options.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.option,
                option.value === value && styles.optionSelected,
              ]}
              onPress={() => handleSelect(option)}
            >
              {option.icon && (
                <View 
                  style={[
                    styles.optionIcon,
                    option.color && { backgroundColor: option.color },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={option.icon}
                    size={20}
                    color={colors.common.white}
                  />
                </View>
              )}
              <Text 
                style={{
                  ...styles.optionText,
                  ...(option.value === value && styles.optionTextSelected),
                }}
              >
                {option.label}
              </Text>
              {option.value === value && (
                <MaterialCommunityIcons
                  name="check"
                  size={20}
                  color={colors.primary.main}
                />
              )}
            </Pressable>
          ))}
        </ScrollView>
      </BottomSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
    color: colors.text.secondary,
    fontSize: typography.size.xs,
  },
  container: {
    borderWidth: 1,
    borderColor: colors.border.main,
    borderRadius: spacing.xs,
    backgroundColor: colors.background.default,
    height: 46,
  },
  containerDisabled: {
    backgroundColor: colors.grey[100],
    borderColor: colors.border.light,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.component.md,
  },
  text: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.size.sm,
    fontFamily: typography.fontFamily.regular,
  },
  placeholder: {
    color: colors.text.secondary,
  },
  textDisabled: {
    color: colors.text.disabled,
    opacity: 0.8,
  },
  helperText: {
    marginTop: spacing.xs,
    color: colors.text.secondary,
    fontSize: 11,
    lineHeight: 11 * typography.lineHeight.normal,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.component.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  optionSelected: {
    backgroundColor: colors.primary.light,
  },
  optionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  optionText: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.text.primary,
  },
  optionTextSelected: {
    color: colors.primary.main,
    fontFamily: typography.fontFamily.medium,
  },
  selectedIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
}) 