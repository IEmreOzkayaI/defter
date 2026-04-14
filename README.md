MARKA ÖNERİSİ
Defter — "Her Sektöre Uyum Sağlayan Otomasyon Altyapısı"
Alternatifler: Operon, FlowDesk, SessionHub
Ben Defter ile devam ediyorum — kısa, akılda kalıcı, sektör-bağımsız.

KAPSAMLI İŞ ANALİZİ VE PLANLAMA
1. Ürün Özeti
Defter, işletmeler için bir işletme otomasyon platformudur. Temel akış her sektörde aynı:
İşlem aç → Hizmet/ürün ekle → süre/koşul takibi → ödeme al (manuel veya POS) → kapat
2. Hedef Sektörler ve Terminoloji Haritası
SektörOturum AdıHizmet BirimiSüre ModeliÖzel GereksinimHamam/Sauna/SPAMüşteri/KabineHizmet (dk bazlı)Süre bitiminde uyarıKabin/oda takibi, paketlerSpor SalonuÜye/GirişDers/Ekstra hizmetAylık üyelik + tek seferlikÜyelik durumu, check-in/outPlayStation CafeKonsol/MasaSaatlik kiralama + marketSayaç (dk/saat)Otomatik süre sayacı, uzatmaİnternet CafeBilgisayar NoSaatlik oturum + marketSayaçCihaz durumu (boş/dolu)Kuru TemizlemeSipariş/FişParça bazlı hizmetTeslim tarihiDurum takibi (yıkamada/hazır/teslim)Butik Kafe/RestoranMasa/AdisyonMenü ürünleri—Masa düzeni, garson atamaSaatlik KiralamaRezervasyonAlan/oda/ekipmanSaat bazlıTakvim/slot yönetimi, depozitoKuaför/BerberRandevu/MüşteriHizmetSüre bazlıPersonel atama, randevu takvimiOtoparkAraç/PlakaSaatlik/günlükSayaçPlaka giriş/çıkış, otomatik hesaplamaHalı SahaSaha/SaatSaha kiralamaSlot bazlıTakvim, ön ödeme
3. Çekirdek (Core) Modüller
A. Session Engine (Ortak Çekirdek)

Oturum CRUD (aç, hizmet ekle, beklet, kapat)
Sepet yönetimi (ürün/hizmet, miktar, fiyat)
Süre sayacı (configurable: yukarı/aşağı sayan)
Durum makinesi: OPEN → IN_PROGRESS → PENDING_PAYMENT → CLOSED
İndirim/kampanya uygulama
Notlar ve etiketler

B. Sektör Template Sistemi

Her sektör bir "template" — kendi terminolojisi, varsayılan kategorileri, ekran düzeni
Kurulum sihirbazı: sektör seç → hazır şablon yüklensin
Özelleştirilebilir: kategori, hizmet, fiyat, süre kuralları

C. Kaynak Yönetimi (Opsiyonel)

Masa/Konsol/Kabine/Oda/Cihaz takibi
Durum: boş / dolu / bakımda / rezerve
Görsel harita düzeni (opsiyonel)

D. Analitik & Raporlama

Günlük/haftalık/aylık ciro
Hizmet bazlı satış dağılımı
Yoğunluk analizi (saat bazlı)
Kapanan oturum geçmişi

E. Ayarlar & Yönetim

Hizmet/Kategori CRUD
Kullanıcı/personel yönetimi
İşletme bilgileri, KDV ayarları
Yazdırma şablonları (fiş/adisyon)

4. Opsiyonel POS Modülü (Ücretli Eklenti)

POS cihaz tanımlama ve durum takibi
Oturumu POS'a gönderme (ödeme talebi)
Ödeme durumu callback (başarılı/başarısız)
Çoklu cihaz desteği
Entegrasyon: iyzico, Param, Paynet vb.

5. Fiyatlandırma Modeli
PlanFiyatİçerikDefter TemelYıllık tek seferlik ödemeOtomasyon, raporlama, sınırsız operasyonDefter + POSTemel + ek ücretPOS entegrasyonu, cihaz yönetimi
6. Teknik Mimari (Yol Haritası)

Frontend: React (web) + React Native / PWA (mobil)
Backend: NestJS, PostgreSQL, Redis
Multi-tenancy: Tenant bazlı izolasyon
Template engine: Sektör şablonları JSON config olarak
Offline-first: Bağlantı kesilse de çalışabilmeli (kritik POS senaryoları)

---

## SEO ve yayın (teknik özet)

Uygulamada yapılanlar: `index.html` başlık ve meta açıklama (~155 karakter), `keywords`, Open Graph / Twitter kartları, `lang="tr"`, canonical ve `og:url` (yer tutucu alan: `defter.app`), fontlar için `preconnect`, `public/robots.txt` (`/demo/` disallow + Sitemap satırı), `public/sitemap.xml` (yalnızca ana sayfa URL’si), landing’de **SSS** bölümü + **JSON-LD** (`Organization`, `WebSite`, `SoftwareApplication` + teklif, `FAQPage`, `HowTo` — onboarding adımlarıyla uyumlu), semantik `<main>`, bölüm `id`’leri ve footer içi iç bağlantılar. İlk paragrafta ürün tanımı (GEO/AI çıkarımı için net cümle).

**Canlıya alırken:** `index.html` ve `public/sitemap.xml` / `robots.txt` içindeki `https://defter.app` adresini gerçek alan adınızla değiştirin. İsteğe bağlı: kök `.env` içinde `VITE_SITE_URL` — yapılandırılmış veride `window` yokken fallback için. **Google Search Console:** site doğrulama, `sitemap.xml` gönderimi, **PageSpeed / Core Web Vitals** izleme; (LCP için ileride font `@import`’u `index.html` üzerinden `link` ile yüklemek düşünülebilir).

İçerik genişletmesi (blog, programatik `/ai-tools/...` sayfaları, backlink) bu repoda yok; ürün stratejisi bu dokümandaki planla ayrıca yürütülmeli.