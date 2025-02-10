import React from 'react'
import { View, Pressable, Platform, Animated } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text } from '../../../components/common/Text'
import { transactionTypes, TransactionType } from '../../../constants/transactions'
import { colors } from '../../../theme'
import { styles } from './TransactionTypeSelector.styles'

type Props = {
  value: TransactionType
  onChange: (value: TransactionType) => void
}

export const TransactionTypeSelector = ({ value, onChange }: Props) => {
  const translateX = React.useRef(new Animated.Value(value === 'income' ? 0 : 1)).current

  React.useEffect(() => {
    Animated.spring(translateX, {
      toValue: value === 'income' ? 0 : 1,
      useNativeDriver: true,
      tension: 30,
      friction: 8,
    }).start()
  }, [value])

  const translateAnim = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 4 + (SELECTOR_WIDTH - BUTTON_WIDTH - 8)]
  })

  return (
    <View style={styles.container}>
      <View style={styles.selector}>
        <Animated.View 
          style={[
            styles.activeBackground,
            { transform: [{ translateX: translateAnim }] }
          ]} 
        />
        {transactionTypes.map(type => (
          <Pressable
            key={type.value}
            style={({ pressed }) => [
              styles.option,
              pressed && styles.pressed
            ]}
            onPress={() => onChange(type.value)}
          >
            <MaterialCommunityIcons
              name={type.icon}
              size={20}
              color={value === type.value ? colors.common.white : colors.text.secondary}
              style={styles.icon}
            />
            <Text
              style={[
                styles.label,
                { color: value === type.value ? colors.common.white : colors.text.secondary },
              ]}
            >
              {type.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const SELECTOR_WIDTH = 280 // Toplam genişlik
const BUTTON_WIDTH = SELECTOR_WIDTH / 2 - 4 // Her bir butonun genişliği 