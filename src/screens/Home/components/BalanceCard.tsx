import React from "react";
import { StyleSheet, View, Pressable, Platform, TextStyle } from "react-native";
import { Text } from "../../../components/common/Text";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/spacing";
import { LinearGradient } from "expo-linear-gradient";
import { formatCurrency } from "../../../utils/currency";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Period } from "../../../types/transaction";

interface BalanceCardProps {
  balance: number;
  income: number;
  expense: number;
  period: Period;
  onPeriodChange: (period: Period) => void;
}

const periods: { value: Period; label: string }[] = [
  { value: "daily", label: "Bugün" },
  { value: "weekly", label: "Bu Hafta" },
  { value: "monthly", label: "Bu Ay" },
  { value: "yearly", label: "Bu Yıl" },
];

export const BalanceCard = ({
  balance,
  income,
  expense,
  period,
  onPeriodChange,
}: BalanceCardProps) => {
  const [showPeriodSelector, setShowPeriodSelector] = React.useState(false);

  const handlePeriodPress = () => {
    setShowPeriodSelector(!showPeriodSelector);
  };

  const handlePeriodSelect = (newPeriod: Period) => {
    onPeriodChange(newPeriod);
    setShowPeriodSelector(false);
  };

  const getPeriodLabel = () => {
    return periods.find((p) => p.value === period)?.label || "Tüm Zamanlar";
  };

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={["#4C5FBA", "#3A4D8C", "#1E2B58"]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.4, 1]}
      >
        <View style={styles.header}>
          <Text variant="label" style={styles.label}>
            Toplam Bakiye
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.periodSelector,
              pressed && styles.periodSelectorPressed,
            ]}
            onPress={handlePeriodPress}
          >
            <Text style={styles.periodText}>{getPeriodLabel()}</Text>
            <MaterialCommunityIcons
              name={showPeriodSelector ? "chevron-up" : "chevron-down"}
              size={20}
              color={colors.white}
            />
          </Pressable>
        </View>

        <Text variant="h1" style={styles.balance}>
          {formatCurrency(balance)}
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text variant="label" style={styles.label}>
              Gelir
            </Text>
            <Text variant="h3" style={[styles.statValue, styles.income]}>
              {formatCurrency(income)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text variant="label" style={styles.label}>
              Gider
            </Text>
            <Text variant="h3" style={[styles.statValue, styles.expense]}>
              {formatCurrency(expense)}
            </Text>
          </View>
        </View>

        {showPeriodSelector && (
          <View style={styles.periodDropdown}>
            {periods.map((p) => (
              <Pressable
                key={p.value}
                style={({ pressed }) => [
                  styles.periodOption,
                  period === p.value && styles.periodOptionSelected,
                  pressed && styles.periodOptionPressed,
                ]}
                onPress={() => handlePeriodSelect(p.value)}
              >
                <Text
                  style={[
                    styles.periodOptionText,
                    period === p.value ? styles.periodOptionTextSelected : {},
                  ]}
                >
                  {p.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 1,
  },
  container: {
    borderRadius: spacing.md,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    color: colors.white,
    opacity: 0.8,
  },
  balance: {
    color: colors.white,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    gap: spacing.xs,
  },
  statValue: {
    color: colors.white,
  },
  income: {
    color: "#00B4FF",
  },
  expense: {
    color: "#FF6B6B",
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: colors.white,
    opacity: 0.2,
    marginHorizontal: spacing.md,
  },
  periodSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
    gap: spacing.xs,
  },
  periodSelectorPressed: {
    opacity: 0.7,
  },
  periodText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "500",
  },
  periodDropdown: {
    position: "absolute",
    top: 60,
    right: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    padding: spacing.xs,
    minWidth: 120,
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: colors.common.black,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  periodOption: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.xs,
  },
  periodOptionPressed: {
    backgroundColor: colors.grey[100],
  },
  periodOptionSelected: {
    backgroundColor: colors.primary.main + "10",
  },
  periodOptionText: {
    fontSize: 14,
    color: colors.text.primary,
  } as TextStyle,
  periodOptionTextSelected: {
    color: colors.primary.main,
    fontWeight: "600",
  } as TextStyle,
});
