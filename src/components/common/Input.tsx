import React from 'react'
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
  Platform,
} from 'react-native'
import { colors, spacing, typography } from '../../theme'
import { Text } from './Text'

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string
  error?: string
  helper?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  containerStyle?: ViewStyle
  inputStyle?: TextStyle
  onRightIconPress?: () => void
}

export const Input = React.forwardRef<TextInput, InputProps>(({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  onRightIconPress,
  editable = true,
  ...props
}, ref) => {
  const labelStyle: TextStyle = {
    ...styles.label,
    ...(error && { color: colors.error.main }),
    ...(!editable && { color: colors.text.disabled }),
  }

  const inputContainerStyle: ViewStyle = {
    ...styles.inputContainer,
    ...(leftIcon && { paddingLeft: 0 }),
    ...(rightIcon && { paddingRight: 0 }),
    ...(error && { 
      borderColor: colors.error.main,
      borderWidth: 2,
    }),
    ...(!editable && styles.inputDisabled),
  }

  const textInputStyle: TextStyle = {
    ...styles.input,
    ...(error && { color: colors.error.main }),
    ...(!editable && { 
      color: colors.text.disabled,
      opacity: 0.8,
    }),
    ...inputStyle,
  }

  const helperStyle: TextStyle = {
    ...styles.helperText,
    ...(error && { color: colors.error.main }),
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="body2" style={labelStyle}>
          {label}
        </Text>
      )}

      <View style={inputContainerStyle}>
        {leftIcon && (
          <View style={[
            styles.leftIcon, 
            !editable && { opacity: 0.8 }
          ]}>
            {leftIcon}
          </View>
        )}

        <TextInput
          ref={ref}
          style={textInputStyle}
          placeholderTextColor={colors.grey[400]}
          editable={editable}
          {...props}
        />

        {rightIcon && (
          <Pressable 
            style={[
              styles.rightIcon,
              !editable && { opacity: 0.8 }
            ]}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </Pressable>
        )}
      </View>

      {(error || helper) && (
        <Text variant="caption" style={helperStyle}>
          {error || helper}
        </Text>
      )}
    </View>
  )
})

Input.displayName = 'Input'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
    color: colors.text.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.main,
    borderRadius: spacing.xs,
    backgroundColor: colors.background.default,
    height: 46,
  },
  input: {
    flex: 1,
    height: '100%',
    color: colors.text.primary,
    fontSize: typography.size.md,
    fontFamily: typography.fontFamily.regular,
    paddingHorizontal: spacing.component.md,
    ...Platform.select({
      ios: {
        paddingVertical: 0,
      },
      android: {
        paddingVertical: 0,
        textAlignVertical: 'center',
      },
    }),
  },
  leftIcon: {
    paddingLeft: spacing.component.md,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  rightIcon: {
    paddingRight: spacing.component.md,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  helperText: {
    marginTop: spacing.xs,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.normal * typography.size.xs,
  },
  inputDisabled: {
    backgroundColor: colors.grey[100],
    borderColor: colors.border.light,
  },
}) 