import React, { useState } from 'react'
import { View, Pressable, Modal, Platform } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { colors } from '../../../theme'
import { Text } from '../../../components/common/Text'
import { styles } from './DatePickerField.styles'

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