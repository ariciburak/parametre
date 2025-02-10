# Geliştirme Standartları ve Kuralları

## 1. Kod Stili ve Yapısı

- TypeScript ile kısa ve teknik kod yazımı
- Fonksiyonel ve deklaratif programlama desenleri kullanımı
- Sınıf yapılarından kaçınma
- İterasyon ve modüler yapı kullanımı
- Değişken adlandırmada yardımcı fiil kullanımı (isLoading, hasError)
- Kod basitliği ve komponent mimarisi:
  - Karmaşık kod yapılarından kaçınılmalı
  - Her mantıksal işlem ayrı bir komponente ayrılmalı (örn: AddTransactionScreen'deki FormField, PhotoUploadField gibi)
  - Tekrarlanan kodlar tespit edildiğinde hemen yeni bir komponente çıkarılmalı
  - Komponentler tek bir sorumluluk prensibine uymalı
  - Büyük ekranlar daha küçük, yönetilebilir komponentlere bölünmeli
- Stil yönetimi:
  - Her screen ve komponentin kendi styles dosyası olmalı (örn: AddTransactionScreen.styles.tsx)
  - Stiller ana dosyadan ayrı tutulmalı ve import edilmeli
  - Stil dosyaları .styles.tsx uzantısı ile oluşturulmalı
  - Platform-specific stiller stil dosyasında yönetilmeli
  - Tema değişkenleri (colors, spacing) stil dosyalarında kullanılmalı

### Dosya Yapısı Hiyerarşisi

Evet, dosyaya kalan kısmı ekleyelim:

```markdown:rules.md
// ... existing code ...

### Dosya Yapısı Hiyerarşisi

```

src/
├── components/ # Yeniden kullanılabilir bileşenler
├── screens/ # Ekran bileşenleri
├── navigation/ # Navigasyon yapılandırması
├── hooks/ # Özel hook'lar
├── utils/ # Yardımcı fonksiyonlar
├── types/ # TypeScript türleri
├── constants/ # Sabit değerler
└── services/ # API servisleri

```

## 2. Adlandırma Kuralları
- Dizin adları: camelCase (örn: components/authWizard)
- Bileşenler: Named exports tercih edilmeli
- Tutarlı adlandırma yapısı

## 3. TypeScript Kullanımı
- Tüm kodlar TypeScript ile yazılmalı
- Interface kullanımı type'a tercih edilmeli
- Fonksiyonel bileşenlerde TypeScript interface kullanımı

## 4. Sözdizimi ve Biçimlendirme
- Pure functions için function keyword kullanımı
- Kısa sözdizimi tercihi
- Deklaratif JSX kullanımı
- Prettier ile kod formatı

## 5. UI ve Stil Standartları
- Expo dahili bileşenleri kullanımı
- Flexbox ve useWindowDimensions ile responsive tasarım
- StyleSheet API kullanımı
- Karanlık mod desteği (useColorScheme)
- react-native-reanimated ve react-native-gesture-handler ile animasyon

## 6. Safe Area Yönetimi
- SafeAreaProvider global kullanımı
- SafeAreaView ile bileşen sarmalama
- SafeAreaScrollView kullanımı
- Context hook'ları tercihi

## 7. Performans Optimizasyonu
- useState/useEffect minimizasyonu
- AppLoading ve SplashScreen optimizasyonu
- Görsel optimizasyonu (WebP, lazy loading)
- Code splitting ve lazy loading
- Profilleme ve debugging
- memo, useMemo ve useCallback kullanımı

## 8. Navigasyon Standartları
- react-navigation kullanımı
- Deep linking ve universal linking
- expo-router ile dinamik rotalar

## 9. Durum Yönetimi
- Zustand ile global state management
- react-query ile API yönetimi
- expo-linking kullanımı

## 10. Temel Geliştirme Standartları
- Expo managed workflow kullanımı
- Mobil Web Vitals optimizasyonu
- expo-permissions ile izin yönetimi
- expo-updates ile OTA güncellemeler
- Cross-platform test süreçleri

## 11. Güvenlik Kuralları
- Hassas verilerin güvenli depolanması
- API anahtarlarının environment variables kullanımı
- Input validasyonu
- Network güvenliği

## 12. Dağıtım ve Yayın
- App Store ve Play Store yönergeleri
- Sürüm kontrolü
- CI/CD pipeline
- Test süreçleri
```
