import React from 'react'
import { View, StyleSheet, SafeAreaView } from 'react-native'
import { Text } from '../../components/common/Text'
import { colors, spacing } from '../../theme'

export const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text>Profil içeriği</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.main,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.screen.sm,
    paddingTop: spacing.sm,
    height: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.common.white,
    marginBottom: spacing.md,
  },
  content: {
    height: "100%",
    backgroundColor: colors.grey[100],
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -20,
  },
}) 