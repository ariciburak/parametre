import { StyleSheet, Platform } from 'react-native'
import { colors, spacing } from '../../../theme'

export const styles = StyleSheet.create({
  dateField: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    ...Platform.select({
      ios: {
        shadowColor: colors.grey[500],
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  fieldContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 20,
    minHeight: 56,
  },
  fieldLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fieldRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    minWidth: 40,
  },
  fieldLabel: {
    fontSize: 15,
    color: colors.text.secondary,
    fontWeight: '500',
  },
}) 