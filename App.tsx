import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from './src/theme';
import { Text } from './src/components/common/Text';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text 
            variant="h1" 
            color={colors.primary.main}
            align="center"
          >
            ParaMetre
          </Text>
          <Text 
            variant="body1"
            color={colors.text.primary}
            align="center"
            style={styles.subtitle}
          >
            Gelir ve gider takip uygulaması
          </Text>
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  subtitle: {
    marginTop: 16,
  },
});
