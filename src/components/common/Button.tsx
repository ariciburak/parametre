import React from 'react'
import { 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacityProps,
  View,
} from 'react-native'
import { colors, spacing, typography } from '../../theme'
import { Text } from './Text'

type ButtonVariant = 'primary' | 'secondary' | 'outline'
type ButtonSize = 'small' | 'medium' | 'large'

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  ...props
}: ButtonProps) => {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ]

  const textColor = variant === 'outline' 
    ? colors.primary.main 
    : colors.common.white

  return (
    <TouchableOpacity 
      style={buttonStyles}
      disabled={disabled || loading}
      {...props}
    >
      <View style={styles.content}>
        {leftIcon && !loading && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}
        
        {loading ? (
          <ActivityIndicator 
            color={textColor}
            size="small"
          />
        ) : (
          <Text 
            style={{
              ...styles.text,
              color: textColor,
            }}
          >
            {children}
          </Text>
        )}

        {rightIcon && !loading && (
          <View style={styles.rightIcon}>
            {rightIcon}
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary.main,
  },
  secondary: {
    backgroundColor: colors.secondary.main,
  },
  outline: {
    backgroundColor: colors.common.transparent,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  small: {
    paddingVertical: spacing.component.xs,
    paddingHorizontal: spacing.component.sm,
  },
  medium: {
    paddingVertical: spacing.component.sm,
    paddingHorizontal: spacing.component.md,
  },
  large: {
    paddingVertical: spacing.component.md,
    paddingHorizontal: spacing.component.lg,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  leftIcon: {
    marginRight: spacing.xs,
  },
  rightIcon: {
    marginLeft: spacing.xs,
  },
  text: {
    fontSize: typography.size.sm,
    fontFamily: typography.fontFamily.medium,
    lineHeight: typography.lineHeight.tight * typography.size.sm,
  },
})
