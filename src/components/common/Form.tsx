import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { Formik, FormikConfig, FormikProps, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { spacing } from '../../theme'
import { Input, InputProps } from './Input'
import { Select, SelectProps } from './Select'
import { Button } from './Button'

export interface FormProps<T> extends Omit<FormikConfig<T>, 'onSubmit'> {
  children: React.ReactNode
  onSubmit: (values: T, helpers: FormikHelpers<T>) => Promise<void> | void
  style?: ViewStyle
  loading?: boolean
  disabled?: boolean
}

function Form<T extends Record<string, any>>({ 
  children, 
  onSubmit, 
  style,
  loading = false,
  disabled = false,
  ...formikProps 
}: FormProps<T>) {
  return (
    <Formik
      onSubmit={onSubmit}
      {...formikProps}
    >
      {(formik) => (
        <View style={[styles.container, style]}>
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return child

            const props = {
              formik,
              disabled: disabled || loading,
              ...child.props,
            }

            return React.cloneElement(child, props)
          })}
        </View>
      )}
    </Formik>
  )
}

// Input alt komponenti
interface FormInputProps extends Omit<InputProps, 'value' | 'onChangeText'> {
  name: string
  formik?: FormikProps<any>
}

const FormInput = ({ 
  name, 
  formik,
  ...props 
}: FormInputProps) => {
  if (!formik) return null

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
  } = formik

  const error = touched[name] && errors[name] 
    ? String(errors[name]) 
    : undefined

  return (
    <Input
      value={String(values[name] || '')}
      onChangeText={handleChange(name)}
      onBlur={handleBlur(name)}
      error={error}
      {...props}
    />
  )
}

// Select alt komponenti
interface FormSelectProps extends Omit<SelectProps, 'value' | 'onSelect'> {
  name: string
  formik?: FormikProps<any>
}

const FormSelect = ({ 
  name, 
  formik,
  ...props 
}: FormSelectProps) => {
  if (!formik) return null

  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
  } = formik

  const error = touched[name] && errors[name] 
    ? String(errors[name]) 
    : undefined

  return (
    <Select
      value={String(values[name] || '')}
      onSelect={(value) => {
        setFieldValue(name, value)
        setFieldTouched(name, true)
      }}
      error={error}
      {...props}
    />
  )
}

// Button alt komponenti
interface FormButtonProps extends Omit<React.ComponentProps<typeof Button>, 'onPress'> {
  formik?: FormikProps<any>
  children: React.ReactNode
}

const FormButton = ({ 
  formik,
  loading,
  disabled,
  children,
  ...props 
}: FormButtonProps) => {
  if (!formik) return null

  const {
    handleSubmit,
    isValid,
    dirty,
  } = formik

  return (
    <Button
      onPress={() => handleSubmit()}
      loading={loading}
      disabled={disabled || !isValid || !dirty}
      {...props}
    >
      {children}
    </Button>
  )
}

// Alt komponentleri Form'a ekle
Form.Input = FormInput
Form.Select = FormSelect
Form.Button = FormButton

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: spacing.md,
  },
})

export { Form } 