import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './src/theme';
import { Text } from './src/components/common/Text';
import { Button } from './src/components/common/Button';
import { Container } from './src/components/common/Container';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [isKeyboardAware, setIsKeyboardAware] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState(colors.background.default)
  const [hasCustomHeader, setHasCustomHeader] = useState(false)

  const toggleLoading = () => {
    setIsLoading(!isLoading)
    // 3 saniye sonra loading'i kapat
    if (!isLoading) {
      setTimeout(() => {
        setIsLoading(false)
      }, 3000)
    }
  }

  const toggleBackgroundColor = () => {
    setBackgroundColor(
      backgroundColor === colors.background.default 
        ? colors.background.paper 
        : colors.background.default
    )
  }

  const customHeader = hasCustomHeader ? (
    <View style={styles.customHeader}>
      <Button 
        size="small"
        variant="outline"
        leftIcon={
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={20} 
            color={colors.primary.main} 
          />
        }
        onPress={() => setHasCustomHeader(false)}
      >
        Geri
      </Button>
      <Text variant="h3" color={colors.primary.main}>
        Özel Başlık
      </Text>
      <Button 
        size="small"
        variant="outline"
        rightIcon={
          <MaterialCommunityIcons 
            name="dots-vertical" 
            size={20} 
            color={colors.primary.main} 
          />
        }
        onPress={() => {}}
      >
        Menü
      </Button>
    </View>
  ) : undefined

  return (
    <SafeAreaProvider>
      <Container 
        scroll 
        loading={isLoading}
        keyboardAware={isKeyboardAware}
        backgroundColor={backgroundColor}
        header={customHeader}
        headerProps={{
          title: !hasCustomHeader ? 'Component Test' : undefined,
        }}
      >
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

        {/* Container Test Section */}
        <View style={styles.buttonContainer}>
          <Text variant="h3" style={styles.sectionTitle}>
            Container Özellikleri
          </Text>
          
          <Button 
            variant="outline"
            style={styles.buttonSpacing}
            onPress={toggleLoading}
            leftIcon={
              <MaterialCommunityIcons 
                name="loading" 
                size={20} 
                color={colors.primary.main} 
              />
            }
          >
            Loading Durumu
          </Button>

          <Button 
            variant="outline"
            style={styles.buttonSpacing}
            onPress={() => setIsKeyboardAware(!isKeyboardAware)}
            leftIcon={
              <MaterialCommunityIcons 
                name="keyboard" 
                size={20} 
                color={colors.primary.main} 
              />
            }
          >
            Keyboard Aware {isKeyboardAware ? '(Açık)' : '(Kapalı)'}
          </Button>

          <Button 
            variant="outline"
            style={styles.buttonSpacing}
            onPress={toggleBackgroundColor}
            leftIcon={
              <MaterialCommunityIcons 
                name="palette" 
                size={20} 
                color={colors.primary.main} 
              />
            }
          >
            Arka Plan Rengi
          </Button>

          <Button 
            variant="outline"
            style={styles.buttonSpacing}
            onPress={() => setHasCustomHeader(!hasCustomHeader)}
            leftIcon={
              <MaterialCommunityIcons 
                name="view-grid" 
                size={20} 
                color={colors.primary.main} 
              />
            }
          >
            Custom Header {hasCustomHeader ? '(Açık)' : '(Kapalı)'}
          </Button>
        </View>

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
      </Container>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
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
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
});
