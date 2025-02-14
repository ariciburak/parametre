import React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text } from '../../../components/common/Text'
import { BottomSheet } from '../../../components/common/BottomSheet'
import { colors, spacing } from '../../../theme'
import { Transaction } from '../../../types/transaction'
import { formatCurrency } from '../../../utils/currency'
import { getCategoryById } from '../../../constants/categories'

interface TransactionDetailModalProps {
  transaction?: Transaction
  visible: boolean
  onClose: () => void
}

export const TransactionDetailModal = ({
  transaction,
  visible,
  onClose,
}: TransactionDetailModalProps) => {
  if (!transaction) return null

  const category = getCategoryById(transaction.categoryId)
  const date = new Date(transaction.date)

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="İşlem Detayı"
    >
      <View style={styles.container}>
        {/* Kategori ve Tutar */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: category?.color }]}>
            <MaterialCommunityIcons
              name={category?.icon || 'help'}
              size={24}
              color={colors.common.white}
            />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.category}>
              {category?.label || 'Diğer'}
            </Text>
            <Text
              style={[
                styles.amount,
                transaction.type === 'income' ? styles.income : styles.expense,
              ]}
            >
              {formatCurrency(transaction.amount)}
            </Text>
          </View>
        </View>

        {/* Detay Bilgileri */}
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tarih</Text>
            <Text style={styles.detailValue}>
              {date.toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tür</Text>
            <Text style={styles.detailValue}>
              {transaction.type === 'income' ? 'Gelir' : 'Gider'}
            </Text>
          </View>

          {transaction.description && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Açıklama</Text>
              <Text style={styles.detailValue}>
                {transaction.description}
              </Text>
            </View>
          )}
        </View>

        {/* Fotoğraf */}
        {transaction.photoUrl && (
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: transaction.photoUrl }}
              style={styles.photo}
              resizeMode="cover"
            />
          </View>
        )}
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  category: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
  },
  income: {
    color: colors.success.main,
  },
  expense: {
    color: colors.error.main,
  },
  details: {
    backgroundColor: colors.grey[50],
    borderRadius: spacing.sm,
    padding: spacing.md,
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    marginLeft: spacing.md,
  },
  photoContainer: {
    marginTop: spacing.lg,
    borderRadius: spacing.sm,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 200,
    backgroundColor: colors.grey[100],
  },
}) 