import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/common/Text';
import { colors, spacing } from '../../../theme';

interface PeriodSelectorProps {
  period: {
    month: number;
    year: number;
  };
  onChange: (period: { month: number; year: number }) => void;
}

export const PeriodSelector = ({ period, onChange }: PeriodSelectorProps) => {
  const handlePrevMonth = () => {
    const newMonth = period.month - 1;
    if (newMonth < 0) {
      onChange({
        month: 11,
        year: period.year - 1,
      });
    } else {
      onChange({
        ...period,
        month: newMonth,
      });
    }
  };

  const handleNextMonth = () => {
    const newMonth = period.month + 1;
    if (newMonth > 11) {
      onChange({
        month: 0,
        year: period.year + 1,
      });
    } else {
      onChange({
        ...period,
        month: newMonth,
      });
    }
  };

  const formatPeriod = () => {
    return new Date(period.year, period.month).toLocaleDateString('tr-TR', {
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handlePrevMonth}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <MaterialCommunityIcons
          name="chevron-left"
          size={24}
          color={colors.text.primary}
        />
      </Pressable>

      <View style={styles.periodContainer}>
        <Text style={styles.periodText}>{formatPeriod()}</Text>
      </View>

      <Pressable
        onPress={handleNextMonth}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={colors.text.primary}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.common.white,
    borderRadius: 16,
    padding: spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: colors.grey[900],
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  button: {
    padding: spacing.xs,
    borderRadius: 8,
  },
  buttonPressed: {
    backgroundColor: colors.grey[100],
  },
  periodContainer: {
    paddingHorizontal: spacing.lg,
  },
  periodText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    textTransform: 'capitalize',
  },
}); 