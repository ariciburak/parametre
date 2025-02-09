# Gelir Gider Takip Uygulaması - PRD

## 1. Ürün Özeti
Gelir Gider Takip Uygulaması, kullanıcıların finansal durumlarını kolayca takip edebilmeleri, gelir ve giderlerini yönetebilmeleri için tasarlanmış mobil bir uygulamadır.

## 2. Hedef Kitle
- Bireysel kullanıcılar
- Aile bütçesi yönetenler
- Küçük işletme sahipleri
- Finansal planlama yapmak isteyenler

## 3. Geliştirme Öncelikleri

### Faz 1: Temel Özellikler (MVP)
1. **Kullanıcı Yönetimi**
   - Kayıt ve giriş sistemi
   - Profil yönetimi
   - Temel ayarlar

2. **Gelir/Gider İşlemleri**
   - Gelir/gider kaydı oluşturma
   - Temel kategoriler
   - Tarih bazlı kayıt
   - Para birimi desteği

3. **Temel Raporlama**
   - Aylık özet görünümü
   - Basit grafik raporları
   - Kategori bazlı analiz

### Faz 2: Gelişmiş Özellikler
1. **Bütçe Yönetimi**
   - Aylık bütçe oluşturma
   - Kategori bazlı limitler
   - Bütçe takip araçları

2. **Gelişmiş Raporlama**
   - Detaylı analiz grafikleri
   - Özelleştirilebilir raporlar
   - Trend analizleri

3. **Fatura Yönetimi**
   - Fatura fotoğrafı ekleme
   - Basit OCR desteği
   - Fatura kategorilendirme

### Faz 3: Premium Özellikler
1. **Akıllı Özellikler**
   - Gelişmiş OCR
   - AI destekli kategori önerileri
   - Harcama analizi ve öneriler

2. **Çoklu Kullanıcı**
   - Aile hesapları
   - Ortak bütçe yönetimi
   - Yetkilendirme sistemi

## 4. Teknik Gereksinimler

### Frontend
- React Native / Expo
- TypeScript
- Zustand (state management)
- Axios (API istekleri)
- React Navigation
- React Native Paper (UI kütüphanesi)

### Backend & Veritabanı
- Firebase Authentication (kullanıcı yönetimi)
- Firebase Firestore (veritabanı)
- Firebase Storage (fatura fotoğrafları)
- Firebase Cloud Functions (gerekirse)

### Depolama
- Firebase Storage (fatura fotoğrafları)
- AsyncStorage (çevrimdışı veri)
- Secure Store (hassas veriler)

### Temel Firebase Koleksiyonları
```typescript
// users
{
  uid: string;
  email: string;
  displayName: string;
  createdAt: timestamp;
  settings: {
    currency: string;
    language: string;
    theme: 'light' | 'dark';
  }
}

// transactions
{
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: timestamp;
  attachmentUrl?: string;
  createdAt: timestamp;
  updatedAt: timestamp;
}

// categories
{
  id: string;
  userId: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
}

// budgets
{
  id: string;
  userId: string;
  month: string; // YYYY-MM
  categoryId: string;
  amount: number;
  spent: number;
}
```

## 5. UI/UX Gereksinimleri

### Tasarım Prensipleri
- Minimalist ve modern tasarım
- Kolay kullanılabilirlik
- Hızlı veri girişi
- Sezgisel navigasyon
- Responsive tasarım

### Tema Desteği
- Açık/koyu tema
- Dinamik renk paleti
- Özelleştirilebilir arayüz

## 6. Güvenlik Gereksinimleri
- End-to-end şifreleme
- Güvenli veri depolama
- Biyometrik kimlik doğrulama
- GDPR uyumluluğu
- Düzenli yedekleme

## 7. Performans Gereksinimleri
- Hızlı yükleme süreleri (<2 saniye)
- Optimize edilmiş veri kullanımı
- Çevrimdışı çalışabilme
- Minimum pil tüketimi
- Düşük internet kullanımı

## 8. Dağıtım Planı
1. **MVP Sürümü**
   - Temel özellikler
   - Firebase entegrasyonu
   - Basit UI/UX
   - Temel CRUD işlemleri

2. **Production Sürümü**
   - Gelişmiş özellikler
   - UI/UX iyileştirmeleri
   - App Store ve Play Store

## 9. Başarı Metrikleri
- Kullanıcı edinme oranı
- Kullanıcı tutma oranı
- Uygulama kullanım süresi
- Kullanıcı memnuniyeti 