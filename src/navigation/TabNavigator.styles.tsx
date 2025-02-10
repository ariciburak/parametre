import { StyleSheet, Platform } from 'react-native'
import { colors } from '../theme'

export const tabBarStyle = {
  position: 'absolute',
  borderTopWidth: 0,
  backgroundColor: Platform.select({
    ios: colors.common.white,
    android: colors.common.white,
  }),
  height: 80,
  paddingHorizontal: 8,
  paddingTop: 12,
  paddingBottom: Platform.OS === 'ios' ? 28 : 8,
  margin: 20,
  borderRadius: 20,
  ...Platform.select({
    ios: {
      shadowColor: colors.common.black,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    },
    android: {
      elevation: 8,
    },
  }),
} as const

export const tabBarLabelStyle = {
  fontSize: 11,
  lineHeight: 14,
  marginTop: 2,
  paddingBottom: 4,
} as const

export const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 36,
    width: 64,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 42,
    height: 28,
    borderRadius: 14,
    marginBottom: 2,
  },
  iconContainerActive: {
    backgroundColor: colors.primary.light + '15', // %15 opacity
  },
  addButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    position: 'absolute',
    top: -32,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary.main,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  addButtonActive: {
    backgroundColor: colors.primary.dark,
    transform: [{ scale: 0.95 }],
  },
  addButtonIcon: {
    transform: [{ translateY: -1 }],
  },
}) 