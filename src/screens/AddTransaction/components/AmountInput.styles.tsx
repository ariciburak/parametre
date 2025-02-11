import { StyleSheet } from 'react-native'
import { colors, spacing } from '../../../theme'

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    padding: 0,
    textAlign: 'right',
  },
  currency: {
    fontSize: 24,
    fontWeight: '600',
  },
}) 