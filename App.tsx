import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from './src/theme';
import { Text } from './src/components/common/Text';
import { Button } from './src/components/common/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
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

            {/* Button Test Section */}
            <View style={styles.buttonContainer}>
              <Text variant="h3" style={styles.sectionTitle}>Button Varyantları</Text>
              <Button onPress={() => {}}>
                Primary Button
              </Button>
              <Button 
                variant="secondary" 
                style={styles.buttonSpacing}
                onPress={() => {}}
              >
                Secondary Button
              </Button>
              <Button 
                variant="outline"
                style={styles.buttonSpacing}
                onPress={() => {}}
              >
                Outline Button
              </Button>

              <Text 
                variant="h3" 
                style={{
                  ...styles.sectionTitle,
                  ...styles.buttonSpacing,
                }}
              >
                Button Boyutları
              </Text>
              <Button 
                size="small"
                onPress={() => {}}
              >
                Small Button
              </Button>
              <Button 
                size="medium"
                style={styles.buttonSpacing}
                onPress={() => {}}
              >
                Medium Button
              </Button>
              <Button 
                size="large"
                style={styles.buttonSpacing}
                onPress={() => {}}
              >
                Large Button
              </Button>

              <Text 
                variant="h3" 
                style={{
                  ...styles.sectionTitle,
                  ...styles.buttonSpacing,
                }}
              >
                İkonlu Buttonlar
              </Text>
              <Button 
                leftIcon={
                  <MaterialCommunityIcons 
                    name="plus" 
                    size={20} 
                    color={colors.common.white} 
                  />
                }
                style={styles.buttonSpacing}
                onPress={() => {}}
              >
                Sol İkonlu
              </Button>
              <Button 
                rightIcon={
                  <MaterialCommunityIcons 
                    name="arrow-right" 
                    size={20} 
                    color={colors.common.white} 
                  />
                }
                style={styles.buttonSpacing}
                onPress={() => {}}
              >
                Sağ İkonlu
              </Button>
              <Button 
                variant="outline"
                leftIcon={
                  <MaterialCommunityIcons 
                    name="account" 
                    size={20} 
                    color={colors.primary.main}
                  />
                }
                rightIcon={
                  <MaterialCommunityIcons 
                    name="chevron-down" 
                    size={20} 
                    color={colors.primary.main}
                  />
                }
                style={styles.buttonSpacing}
                onPress={() => {}}
              >
                Çift İkonlu
              </Button>

              <Text 
                variant="h3" 
                style={{
                  ...styles.sectionTitle,
                  ...styles.buttonSpacing,
                }}
              >
                Özel Durumlar
              </Text>
              <Button 
                loading
                style={styles.buttonSpacing}
                onPress={() => {}}
              >
                Loading Button
              </Button>
              <Button 
                disabled
                style={styles.buttonSpacing}
                onPress={() => {}}
              >
                Disabled Button
              </Button>
              <Button 
                fullWidth
                style={styles.buttonSpacing}
                onPress={() => {}}
              >
                Full Width Button
              </Button>
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
  },
  subtitle: {
    marginTop: 16,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 32,
  },
  buttonSpacing: {
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 16,
  },
});
