import { StyleSheet } from 'react-native'
import { colors, spacing } from '../../../theme'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  categorySelected: {
    backgroundColor: colors.primary.light + '15', // %15 opacity
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
}) 