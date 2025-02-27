import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TabNavigator } from "./src/navigation/TabNavigator";
import { AuthNavigator } from "./src/navigation/AuthNavigator";
import { useAuthStore } from './src/store/useAuthStore';
import { useEffect } from 'react';
import { auth } from './src/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { View, ActivityIndicator } from 'react-native';

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

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser]);


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
