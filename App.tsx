import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TabNavigator } from "./src/navigation/TabNavigator";
import { AuthNavigator } from "./src/navigation/AuthNavigator";
import { useAuthStore } from './src/store/useAuthStore';
import { useEffect } from 'react';
import { auth } from './src/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { View, ActivityIndicator } from 'react-native';
import useTransactionStore from './src/store/useTransactionStore';
import useBudgetStore from './src/store/useBudgetStore';

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

function Navigation() {
  const user = useAuthStore(state => state.user);
  const isInitialized = useAuthStore(state => state.isInitialized);
  const setUser = useAuthStore(state => state.setUser);
  const initialize = useAuthStore(state => state.initialize);
  const initializeTransactions = useTransactionStore(state => state.initialize);
  const initializeBudgets = useBudgetStore(state => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    let unsubscribeTransactions: (() => void) | undefined;
    let unsubscribeBudgets: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      
      if (user) {
        // Kullanıcı oturum açtığında store'ları başlat
        unsubscribeTransactions = initializeTransactions();
        unsubscribeBudgets = initializeBudgets();
      } else {
        // Kullanıcı çıkış yaptığında listener'ları temizle
        if (unsubscribeTransactions) unsubscribeTransactions();
        if (unsubscribeBudgets) unsubscribeBudgets();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeTransactions) unsubscribeTransactions();
      if (unsubscribeBudgets) unsubscribeBudgets();
    };
  }, [setUser, initializeTransactions, initializeBudgets]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return user ? <TabNavigator /> : <AuthNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
