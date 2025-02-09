import React from 'react'
import {
  View,
  Modal,
  StyleSheet,
  Animated,
  Pressable,
  Dimensions,
  ViewStyle,
} from 'react-native'
import { colors, spacing } from '../../theme'
import { Text } from './Text'

const SCREEN_HEIGHT = Dimensions.get('window').height
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.5

interface BottomSheetProps {
  visible: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  height?: number
  style?: ViewStyle
}

export const BottomSheet = ({
  visible,
  onClose,
  title,
  children,
  height = BOTTOM_SHEET_HEIGHT,
  style,
}: BottomSheetProps) => {
  const translateY = React.useRef(new Animated.Value(height)).current
  const opacity = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible, height])

  if (!visible) return null

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Pressable 
          style={styles.backdrop} 
          onPress={onClose}
        >
          <Animated.View 
            style={[
              styles.backdropContent,
              { opacity },
            ]} 
          />
        </Pressable>

        <Animated.View
          style={[
            styles.content,
            { height, transform: [{ translateY }] },
            style,
          ]}
        >
          <View style={styles.header}>
            <View style={styles.handle} />
            {title && (
              <Text variant="h3" style={styles.title}>
                {title}
              </Text>
            )}
          </View>

          <View style={styles.body}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
  },
  backdropContent: {
    flex: 1,
    backgroundColor: colors.common.black,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background.default,
    borderTopLeftRadius: spacing.md,
    borderTopRightRadius: spacing.md,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.grey[300],
    borderRadius: 2,
    marginBottom: spacing.xs,
  },
  title: {
    textAlign: 'center',
  },
  body: {
    flex: 1,
  },
}) 