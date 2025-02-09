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
  Animated,
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
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = React.useState(false)
  const focusAnim = React.useRef(new Animated.Value(0)).current

  const handleFocus = (e: any) => {
    setIsFocused(true)
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start()
    onFocus?.(e)
  }

  const handleBlur = (e: any) => {
    setIsFocused(false)
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
    onBlur?.(e)
  }

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border.main, colors.primary.main],
  })

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
    ...(isFocused && !error && { borderColor: colors.primary.main }),
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

      <Animated.View style={[inputContainerStyle, { borderColor }]}>
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
          onFocus={handleFocus}
          onBlur={handleBlur}
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
      </Animated.View>

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
    fontSize: typography.size.xs,
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
    fontSize: typography.size.sm,
    fontFamily: typography.fontFamily.regular,
    paddingHorizontal: spacing.component.md,
    ...Platform.select({
      ios: {
        paddingVertical: 0,
      },
      android: {
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
    fontSize: 11,
    lineHeight: 11 * typography.lineHeight.normal,
  },
  inputDisabled: {
    backgroundColor: colors.grey[100],
    borderColor: colors.border.light,
  },
}) 