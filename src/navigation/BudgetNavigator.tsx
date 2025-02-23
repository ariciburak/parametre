import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { BudgetScreen } from '../screens/Budget/BudgetScreen'
import { AddBudgetScreen } from '../screens/Budget/AddBudgetScreen'
import { BudgetDetailScreen } from '../screens/Budget/BudgetDetailScreen'
import type { BudgetStackParamList } from './types'

const BudgetStack = createNativeStackNavigator<BudgetStackParamList>()

export const BudgetNavigator = () => {
  return (
    <BudgetStack.Navigator 
      screenOptions={{
        headerShown: false,
        presentation: 'modal'
      }}
    >
      <BudgetStack.Screen 
        name="BudgetList" 
        component={BudgetScreen}
        options={{
          presentation: 'card'
        }}
      />
      <BudgetStack.Screen 
        name="AddBudget" 
        component={AddBudgetScreen}
      />
      <BudgetStack.Screen 
        name="BudgetDetail" 
        component={BudgetDetailScreen}
      />
    </BudgetStack.Navigator>
  )
} 