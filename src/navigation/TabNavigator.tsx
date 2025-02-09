import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { TabParamList } from './types'
import { colors } from '../theme'
import { View, StyleSheet, Platform, Dimensions } from 'react-native'

// Screens
import { HomeScreen } from '../screens/Home/HomeScreen'
import { TransactionsScreen } from '../screens/Transactions/TransactionsScreen'
import { AddTransactionScreen } from '../screens/add-transaction/AddTransactionScreen'
import { ReportsScreen } from '../screens/Reports/ReportsScreen'
import { ProfileScreen } from '../screens/profile/ProfileScreen'

const Tab = createBottomTabNavigator<TabParamList>()
const { width } = Dimensions.get('window')

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          backgroundColor: Platform.select({
            ios: colors.common.white,
            android: colors.common.white,
          }),
          height: 80,
          paddingHorizontal: 8,
          paddingTop: 12,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          margin: 20,
          borderRadius: 20,
          ...Platform.select({
            ios: {
              shadowColor: colors.common.black,
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.1,
              shadowRadius: 12,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          lineHeight: 14,
          marginTop: 2,
          paddingBottom: 4,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <MaterialCommunityIcons 
                  name="home" 
                  size={24} 
                  color={focused ? colors.primary.main : colors.text.secondary} 
                />
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Transactions" 
        component={TransactionsScreen}
        options={{
          title: 'İşlemler',
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <MaterialCommunityIcons 
                  name="format-list-bulleted" 
                  size={24} 
                  color={focused ? colors.primary.main : colors.text.secondary} 
                />
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="AddTransaction" 
        component={AddTransactionScreen}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View style={styles.addButtonContainer}>
              <View style={[styles.addButton, focused && styles.addButtonActive]}>
                <MaterialCommunityIcons 
                  name="plus" 
                  size={32} 
                  color={colors.common.white} 
                  style={styles.addButtonIcon}
                />
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Reports" 
        component={ReportsScreen}
        options={{
          title: 'Raporlar',
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <MaterialCommunityIcons 
                  name="chart-bar" 
                  size={24} 
                  color={focused ? colors.primary.main : colors.text.secondary} 
                />
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <MaterialCommunityIcons 
                  name="account" 
                  size={24} 
                  color={focused ? colors.primary.main : colors.text.secondary} 
                />
              </View>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 36,
    width: 64,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 42,
    height: 28,
    borderRadius: 14,
    marginBottom: 2,
  },
  iconContainerActive: {
    backgroundColor: colors.primary.light + '15', // %15 opacity
  },
  addButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    position: 'absolute',
    top: -32,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary.main,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  addButtonActive: {
    backgroundColor: colors.primary.dark,
    transform: [{ scale: 0.95 }],
  },
  addButtonIcon: {
    transform: [{ translateY: -1 }],
  },
}) 