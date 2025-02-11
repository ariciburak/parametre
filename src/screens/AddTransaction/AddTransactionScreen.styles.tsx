import { StyleSheet, Platform } from 'react-native'
import { colors, spacing } from '../../theme'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.main,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screen.sm,
    paddingTop: spacing.md,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.common.white,
    marginBottom: spacing.xl,
  },
  content: {
    flex: 1,
    backgroundColor: colors.common.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -20,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    padding: spacing.screen.sm,
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
    padding: 0,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 110 : 80,
    left: 0,
    right: 0,
    backgroundColor: colors.common.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    padding: spacing.screen.sm,
    paddingBottom: spacing.md,
    zIndex: 1000,
    elevation: 1000,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 180 : 150,
  },
  keyboardDismissButton: {
    position: 'absolute',
    right: spacing.md,
    bottom: Platform.OS === 'ios' ? 180 : 150,
    zIndex: 1001,
    elevation: 1001,
  },
  dismissButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.common.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.common.black,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  dismissButtonPressed: {
    opacity: 0.7,
  },
}) 