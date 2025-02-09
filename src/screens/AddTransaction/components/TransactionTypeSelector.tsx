import React from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text } from '../../../components/common/Text'
import { transactionTypes, TransactionType } from '../../../constants/transactions'

type Props = {
  value: TransactionType
  onChange: (value: TransactionType) => void
}

export const TransactionTypeSelector = ({ value, onChange }: Props) => {
  return (
    <View style={styles.container}>
      {transactionTypes.map(type => (
        <Pressable
          key={type.value}
          style={[
            styles.option,
            { borderColor: type.color },
            value === type.value && { backgroundColor: type.color },
          ]}
          onPress={() => onChange(type.value)}
        >
          <MaterialCommunityIcons
            name={type.icon}
            size={24}
            color={value === type.value ? '#fff' : type.color}
          />
          <Text
            style={[
              styles.label,
              { color: value === type.value ? '#fff' : type.color },
            ]}
          >
            {type.label}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
}) 