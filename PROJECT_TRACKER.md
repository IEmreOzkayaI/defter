#  Defter - Is Takip Dokumani

## Bu Is Aslinda Ne?

Bu proje, **kağıt adisyon / fiş / takip defteri** kullanan işletmeler için dijital operasyon prototipidir; randevu-first veya üyelik CRM ürünü değildir (bkz. `docs/05-product-scope-and-roadmap.md`).

Temel akis:

1. Landing (istege bagli: navbar uzerinden giris — demo icinde ayri login yok)
2. Demo plan secimi (Temel / Temel+POS) → onboarding **direkt sektor secimi** ile baslar
3. Onboarding (sektor + isletme / oturum etiketi + ozet)
4. Session bazli operasyon (oturum acma, hizmet ekleme, odeme, kapatma)
5. Profil (sol alttan): e-posta, telefon, sifre, sektor tercihi (demo)
6. Raporlama ve yonetim ekranlari

Amac, landing + demo uzerinden urunun ne oldugunu gostermek ve temel operasyon akisini test edilebilir hale getirmektir.

## Bu Turde Neler Yapildi?

- Demo icindeki login kaldirildi; giris **landing navbar** uzerinden (modal).
- Demo onboarding akisi **sektor secimi** ile basliyor (login ekrani yok).
- Oturum sekmesi etiketi sabit "MASALAR" degil; **sablon `resourceLabel` + sektor** ile `getSessionsNavLabel` uzerinden dinamik (or. KABİNELER, MASALAR, KONSOLLAR).
- Analiz ekrani: kapali ciro, acik tahmini, ortalama sepet (kapali), haftalik grafik etiketi; en cok satilanlar kapali oturumlardan toplaniyor (yoksa sablon onerisi).
- Hizmetler: yeni hizmet formu kart duzenine alindi (mobil uyumlu satir kirilimi).
- Profil ekrani: e-posta, telefon, sifre, sektor; demo alt bar sol **hesap chip** ile aciliyor (header’daki email kaldirildi).
- Onceki surum: template preset (`hamam`, `ps`, `cafe`), hizmet/kategori CRUD, landing ozellik kartlari genisletmesi.

## Roadmap (urun)

- Kaynak: `docs/05-product-scope-and-roadmap.md` — Faz 1: kafe, PS/net, hamam, bilardo; Faz 2–3 ve niş sektörler sırayla.

## Siradaki Isler (Backlog)

### Yuksek Oncelik

- [ ] Kaynak yonetimi icin demo icinde ayri ekran (masa/kabine/konsol durumu: bos/dolu/bakim/rezerve)
- [ ] Indirim/kampanya motorunu session sepetine ekleme
- [ ] Oturum durum makinesi gorunumunu belirginlestirme (OPEN/IN_PROGRESS/PENDING_PAYMENT/CLOSED)
- [ ] Kullanici/personel yonetimi icin temel liste + rol alanlari

### Orta Oncelik

- [ ] Template preset sayisini README'deki sektorlerin tamamina cikarma
- [ ] Onboarding + profil verisini kalici hale getirme (local storage veya backend mock)
- [ ] Haftalik grafigi gercek oturum verisine baglama (simdilik ornek seri)
- [ ] POS callback simulasyonu (basarili/basarisiz odeme sonucu)

### Dusuk Oncelik

- [ ] Multi-tenancy ve offline-first kisimlari icin UI hazirlik ekranlari
- [ ] Yazdirma sablonlari ve fis/adisyon cikti onizlemesi

## Notlar

- Bu dokuman canli backlog gibi kullanilacak.
- Her buyuk degisiklikten sonra "Bu Turde Neler Yapildi?" ve "Siradaki Isler" bolumleri guncellenmeli.
