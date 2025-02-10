import React, { useState } from 'react'
import { View, StyleSheet, Pressable, Modal, Platform } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { colors, spacing } from '../../../theme'
import { Text } from '../../../components/common/Text'

interface DatePickerFieldProps {
  value: Date
  onChange: (date: Date) => void
}

export const DatePickerField = ({
  value,
  onChange,
}: DatePickerFieldProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [tempDate, setTempDate] = useState<Date>(value)

  const handleDateChange = (_: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false)
      if (selectedDate) {
        onChange(selectedDate)
      }
    } else if (selectedDate) {
      setTempDate(selectedDate)
    }
  }

  const handleConfirmDate = () => {
    onChange(tempDate)
    setShowDatePicker(false)
  }

  const handleOpenDatePicker = () => {
    setTempDate(value)
    setShowDatePicker(true)
  }

  const renderDatePicker = () => {
    if (Platform.OS === 'android') {
      return showDatePicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleDateChange}
          locale="tr-TR"
        />
      )
    }

    return (
      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowDatePicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tarih Seçin</Text>
              <Pressable 
                style={styles.modalCloseButton}
                onPress={() => setShowDatePicker(false)}
              >
                <MaterialCommunityIcons 
                  name="close" 
                  size={24} 
                  color={colors.text.primary} 
                />
              </Pressable>
            </View>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              textColor={colors.text.primary}
              style={styles.datePicker}
              locale="tr-TR"
            />
            <Pressable 
              style={styles.modalButton}
              onPress={handleConfirmDate}
            >
              <Text style={styles.modalButtonText}>Tamam</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    )
  }

  return (
    <>
      <Pressable 
        style={styles.field}
        onPress={handleOpenDatePicker}
        android_ripple={{ color: colors.grey[200] }}
      >
        <View style={styles.fieldContent}>
          <View style={styles.fieldLeft}>
            <MaterialCommunityIcons 
              name="calendar" 
              size={22} 
              color={colors.text.secondary} 
            />
            <Text style={styles.fieldLabel}>Tarih</Text>
          </View>
          <View style={styles.fieldRight}>
            <Text style={styles.dateValue}>
              {value.toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
                weekday: 'long'
              })}
            </Text>
          </View>
        </View>
      </Pressable>

      {renderDatePicker()}
    </>
  )
}

const styles = StyleSheet.create({
  field: {
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
  dateValue: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '500',
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.common.white,
    borderRadius: 16,
    width: '85%',
    padding: spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  modalCloseButton: {
    padding: 4,
  },
  datePicker: {
    height: 200,
  },
  modalButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary.main,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  modalButtonText: {
    color: colors.common.white,
    fontSize: 16,
    fontWeight: '600',
  },
}) 