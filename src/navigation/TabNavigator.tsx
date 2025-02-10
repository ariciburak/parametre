import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { TabParamList } from './types'
import { colors } from '../theme'
import { View, Platform, Dimensions, Animated } from 'react-native'
import { styles, tabBarStyle, tabBarLabelStyle } from './TabNavigator.styles'

// Screens
import { HomeScreen } from '../screens/Home/HomeScreen'
import { TransactionsScreen } from '../screens/Transactions/TransactionsScreen'
import { AddTransactionScreen } from '../screens/AddTransaction'
import { ReportsScreen } from '../screens/Reports/ReportsScreen'
import { ProfileScreen } from '../screens/profile/ProfileScreen'

const Tab = createBottomTabNavigator<TabParamList>()
const { width } = Dimensions.get('window')

export const TabNavigator = () => {
  const [isAddButtonPressed, setIsAddButtonPressed] = React.useState(false)
  const scaleAnimation = React.useRef(new Animated.Value(0)).current
  const fadeOutAnimation = React.useRef(new Animated.Value(1)).current
  const fadeInAnimation = React.useRef(new Animated.Value(0)).current
  const bounceAnimations = {
    Home: React.useRef(new Animated.Value(0)).current,
    Transactions: React.useRef(new Animated.Value(0)).current,
    AddTransaction: React.useRef(new Animated.Value(0)).current,
    Reports: React.useRef(new Animated.Value(0)).current,
    Profile: React.useRef(new Animated.Value(0)).current,
  }

  React.useEffect(() => {
    if (isAddButtonPressed) {
      Animated.parallel([
        Animated.spring(scaleAnimation, {
          toValue: 1,
          useNativeDriver: true,
          tension: 40,
          friction: 7
        }),
        Animated.timing(fadeOutAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true
        }),
        Animated.timing(fadeInAnimation, {
          toValue: 1,
          duration: 200,
          delay: 100,
          useNativeDriver: true
        })
      ]).start()
    } else {
      Animated.parallel([
        Animated.spring(scaleAnimation, {
          toValue: 0,
          useNativeDriver: true,
          tension: 40,
          friction: 7
        }),
        Animated.timing(fadeOutAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(fadeInAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true
        })
      ]).start()
    }
  }, [isAddButtonPressed])

  const scale = scaleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.9]
  })

  const bounce = (screen: keyof TabParamList) => {
    bounceAnimations[screen].setValue(0)
    Animated.sequence([
      Animated.timing(bounceAnimations[screen], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnimations[screen], {
        toValue: 0,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start()
  }

  const getTranslateY = (screen: keyof TabParamList) => {
    return bounceAnimations[screen].interpolate({
      inputRange: [0, 1],
      outputRange: [0, -10]
    })
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle,
        tabBarLabelStyle,
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
              <Animated.View 
                style={[
                  styles.iconContainer, 
                  focused && styles.iconContainerActive,
                  { transform: [{ translateY: getTranslateY('Home') }] }
                ]}
              >
                <MaterialCommunityIcons 
                  name="home" 
                  size={24} 
                  color={focused ? colors.primary.main : colors.text.secondary} 
                />
              </Animated.View>
            </View>
          ),
        }}
        listeners={{
          tabPress: () => bounce('Home')
        }}
      />
      <Tab.Screen 
        name="Transactions" 
        component={TransactionsScreen}
        options={{
          title: 'İşlemler',
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <Animated.View 
                style={[
                  styles.iconContainer, 
                  focused && styles.iconContainerActive,
                  { transform: [{ translateY: getTranslateY('Transactions') }] }
                ]}
              >
                <MaterialCommunityIcons 
                  name="format-list-bulleted" 
                  size={24} 
                  color={focused ? colors.primary.main : colors.text.secondary} 
                />
              </Animated.View>
            </View>
          ),
        }}
        listeners={{
          tabPress: () => bounce('Transactions')
        }}
      />
      <Tab.Screen 
        name="AddTransaction" 
        component={AddTransactionScreen}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View style={styles.addButtonContainer}>
              <Animated.View 
                style={[
                  styles.addButton, 
                  focused && styles.addButtonActive,
                  { transform: [{ translateY: getTranslateY('AddTransaction') }] }
                ]}
              >
                <MaterialCommunityIcons 
                  name="plus" 
                  size={32} 
                  color={colors.common.white} 
                  style={styles.addButtonIcon}
                />
              </Animated.View>
            </View>
          ),
        }}
        listeners={{
          tabPress: () => bounce('AddTransaction')
        }}
      />
      <Tab.Screen 
        name="Reports" 
        component={ReportsScreen}
        options={{
          title: 'Raporlar',
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <Animated.View 
                style={[
                  styles.iconContainer, 
                  focused && styles.iconContainerActive,
                  { transform: [{ translateY: getTranslateY('Reports') }] }
                ]}
              >
                <MaterialCommunityIcons 
                  name="chart-bar" 
                  size={24} 
                  color={focused ? colors.primary.main : colors.text.secondary} 
                />
              </Animated.View>
            </View>
          ),
        }}
        listeners={{
          tabPress: () => bounce('Reports')
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <Animated.View 
                style={[
                  styles.iconContainer, 
                  focused && styles.iconContainerActive,
                  { transform: [{ translateY: getTranslateY('Profile') }] }
                ]}
              >
                <MaterialCommunityIcons 
                  name="account" 
                  size={24} 
                  color={focused ? colors.primary.main : colors.text.secondary} 
                />
              </Animated.View>
            </View>
          ),
        }}
        listeners={{
          tabPress: () => bounce('Profile')
        }}
      />
    </Tab.Navigator>
  )
} 