import { StyleSheet, Platform } from 'react-native'
import { colors, spacing } from '../../../theme'

const SELECTOR_WIDTH = 280 // Toplam genişlik
const BUTTON_WIDTH = SELECTOR_WIDTH / 2 - 4 // Her bir butonun genişliği

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  selector: {
    width: SELECTOR_WIDTH,
    flexDirection: 'row',
    backgroundColor: colors.grey[200],
    borderRadius: 16,
    padding: 4,
    position: 'relative',
    height: 52,
  },
  activeBackground: {
    position: 'absolute',
    width: BUTTON_WIDTH,
    top: 4,
    bottom: 4,
    backgroundColor: colors.primary.main,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary.main,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  option: {
    width: BUTTON_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
}) 