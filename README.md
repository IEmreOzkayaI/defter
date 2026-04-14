MARKA ÖNERİSİ
OpsGrid — "Her Sektöre Uyum Sağlayan Otomasyon Altyapısı"
Alternatifler: Operon, FlowDesk, SessionHub
Ben OpsGrid ile devam ediyorum — kısa, akılda kalıcı, sektör-bağımsız.

KAPSAMLI İŞ ANALİZİ VE PLANLAMA
1. Ürün Özeti
OpsGrid, session-based (oturum/sepet tabanlı) bir otomasyon platformu. Temel akış her sektörde aynı:
Oturum Aç → Hizmet/Ürün Ekle → Süre/Koşul Takibi → Ödeme Al (Manuel veya POS) → Kapat
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
PlanFiyatİçerikOpsGrid TemelYıllık tek seferlik ödemeOtomasyon, raporlama, sınırsız oturumOpsGrid + POSTemel + ek ücretPOS entegrasyonu, cihaz yönetimi
6. Teknik Mimari (Yol Haritası)

Frontend: React (web) + React Native / PWA (mobil)
Backend: NestJS, PostgreSQL, Redis
Multi-tenancy: Tenant bazlı izolasyon
Template engine: Sektör şablonları JSON config olarak
Offline-first: Bağlantı kesilse de çalışabilmeli (kritik POS senaryoları)