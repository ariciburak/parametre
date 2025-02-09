import React from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing } from '../../theme'
import { Text } from './Text'

interface ContainerProps {
  children: React.ReactNode
  scroll?: boolean
  style?: ViewStyle
  contentContainerStyle?: ViewStyle
  loading?: boolean
  header?: React.ReactNode
  headerProps?: {
    showBackButton?: boolean
    title?: string
    rightComponent?: React.ReactNode
  }
  backgroundColor?: string
  safeArea?: boolean
  keyboardAware?: boolean
}

export const Container = ({
  children,
  scroll = false,
  style,
  contentContainerStyle,
  loading = false,
  header,
  headerProps,
  backgroundColor = colors.background.default,
  safeArea = true,
  keyboardAware = false,
}: ContainerProps) => {
  const Wrapper = safeArea ? SafeAreaView : View
  const Content = scroll ? ScrollView : View

  const containerStyle = [
    styles.container,
    { backgroundColor },
    style,
  ]

  const contentStyle = [
    styles.content,
    !scroll && styles.contentFlex,
    contentContainerStyle,
  ]

  const renderHeader = () => {
    if (!header && !headerProps?.title) return null

    return (
      <View style={styles.header}>
        {header || (
          <Text variant="h2" style={styles.headerTitle}>
            {headerProps?.title}
          </Text>
        )}
      </View>
    )
  }

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      )
    }

    if (scroll) {
      return (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={contentStyle}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      )
    }

    return <View style={contentStyle}>{children}</View>
  }

  const renderContainer = () => (
    <Wrapper style={containerStyle}>
      {renderHeader()}
      {renderContent()}
    </Wrapper>
  )

  if (keyboardAware) {
    return (
      <KeyboardAvoidingView
        style={styles.keyboardAware}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {renderContainer()}
      </KeyboardAvoidingView>
    )
  }

  return renderContainer()
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.screen.sm,
  },
  contentFlex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    padding: spacing.screen.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    textAlign: 'center',
  },
  keyboardAware: {
    flex: 1,
  },
})
