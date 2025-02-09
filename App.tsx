import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './src/theme';
import { Text } from './src/components/common/Text';
import { Button } from './src/components/common/Button';
import { Container } from './src/components/common/Container';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Input } from './src/components/common/Input';
import { Select, SelectOption } from './src/components/common/Select';

export default function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [isKeyboardAware, setIsKeyboardAware] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState(colors.background.default)
  const [hasCustomHeader, setHasCustomHeader] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')

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

  const categories: SelectOption[] = [
    { label: 'Yiyecek & İçecek', value: 'food', icon: 'food', color: colors.secondary.main },
    { label: 'Ulaşım', value: 'transport', icon: 'bus', color: colors.primary.main },
    { label: 'Alışveriş', value: 'shopping', icon: 'shopping', color: colors.warning.main },
    { label: 'Faturalar', value: 'bills', icon: 'file-document', color: colors.error.main },
  ]

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

        {/* Input Test Section */}
        <View style={styles.buttonContainer}>
          <Text variant="h3" style={styles.sectionTitle}>
            Input Özellikleri
          </Text>

          <Input
            label="Normal Input"
            placeholder="Bir değer girin"
          />

          <Input
            label="Error Input"
            error="Hata mesajı"
            value="Hatalı değer"
          />

          <Input
            label="Helper Text"
            helper="Yardımcı metin"
            placeholder="Bir değer girin"
          />

          <Input
            label="Disabled Input"
            value="Disabled value"
            editable={false}
          />

          <Input
            label="Username"
            placeholder="Kullanıcı adınızı girin"
            leftIcon={
              <MaterialCommunityIcons 
                name="account" 
                size={20} 
                color={colors.text.secondary} 
              />
            }
          />

          <Input
            label="Password"
            placeholder="Şifrenizi girin"
            secureTextEntry={!showPassword}
            rightIcon={
              <MaterialCommunityIcons 
                name={showPassword ? "eye-off" : "eye"} 
                size={20} 
                color={colors.text.secondary} 
              />
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <Input
            label="Email"
            leftIcon={
              <MaterialCommunityIcons 
                name="email" 
                size={20} 
                color={colors.text.secondary} 
              />
            }
            rightIcon={
              <MaterialCommunityIcons 
                name="check" 
                size={20} 
                color={colors.secondary.main} 
              />
            }
            value="test@email.com"
          />
        </View>

        {/* Select Test Section */}
        <View style={styles.buttonContainer}>
          <Text variant="h3" style={styles.sectionTitle}>
            Select Özellikleri
          </Text>

          <Select
            label="Normal Select"
            options={categories}
            value={selectedCategory}
            onSelect={setSelectedCategory}
          />

          <Select
            label="Error Select"
            error="Hata mesajı"
            options={categories}
          />

          <Select
            label="Helper Text"
            helper="Yardımcı metin"
            options={categories}
          />

          <Select
            label="Disabled Select"
            options={categories}
            value={categories[0].value}
            disabled
          />
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
