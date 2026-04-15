# Ürün kapsamı ve yol haritası

Bu belge, Defter’in **daraltılmış ürün tanımını**, hedef sektörleri, **bilinçli olarak dışarıda bırakılan** iş modellerini ve **faz bazlı roadmap**’i tek yerde toplar. Pazarlama (landing), demo ve teknik backlog bu çerçeveye göre hizalanır.

---

## Ürün tanımı (daraltılmış kapsam)

**Defter = kağıt adisyon / fiş / takip defteri kullanılan işletmelerin dijital karşılığı.**

Yani ürün özü:

> **Adisyon + işlem takibi + süre / ürün yazılan dijital defter**

Akış: **anlık işlem aç → içine yaz → süreçte tut → kapat**.

### Kimler için (kağıt metaforu)

Bugün kağıda yazılan:

- masa adisyonu
- kabin kağıdı
- fiş
- sipariş notu
- iş takip kartı

gibi modelleri dijitalleştirmek isteyen işletmeler.

### Bilinçli olarak dışarıda (Defter değil)

Bu iş modelleri ürünü dağıtır; bunlar **CRM / randevu / üyelik ağırlıklı** ürünlerdir:

- Randevu-first işler (psikolog, diyetisyen vb.)
- CRM / üyelik ağırlıklı işler (ör. klasik spor salonu üyelik modeli)
- Randevu-ağırlıklı kuaför / berber (booking uygulaması ihtiyacı)
- Danışmanlık, eğitim yönetim sistemleri

👉 Bunlar **Defter değil**; ayrı ürün kategorisi (booking, CRM).

---

## Golden rule (yeni sektör filtresi)

Yeni bir sektör veya şablon eklerken sor:

1. Bu işletme bugün **kağıda** yazıyor mu?
2. **Açık işlemleri** gözle takip ediyor mu?
3. **“Bu hesap kapanmış mı?”** problemi yaşıyor mu?

**Üçü de evet →** kapsam içi aday.  
**Hayır ağırlıklı →** ekleme (veya MVP dışı backlog).

---

## En doğru sektörler (tam fit)

| # | Sektör | Not |
|---|--------|-----|
| 1 | Kafe / restoran (adisyon) | Masa aç → ürün yaz → hesap al → kapat — çekirdek vaka |
| 2 | PlayStation cafe / internet cafe | Cihaz aç → süre işler → ürün eklenir; kağıt + kronometre problemi |
| 3 | Hamam / sauna / SPA | Kabin aç → hizmetler yazılır → süre takibi |
| 4 | Oto yıkama | Araç gelir → yapılan işlemler yazılır; kağıt fiş yaygın |
| 5 | Halı saha | Saha + saat; çoğu yerde hâlâ defter |
| 6 | Bilardo / langırt | Masa aç → süre + içecek |

---

## Güçlü ama sık atlanan sektörler

| # | Sektör | Not |
|---|--------|-----|
| 7 | Kuru temizleme | Kağıt fiş; “teslim edildi mi?” |
| 8 | Teknik servis (telefon / PC) | Kağıt servis fişi; zayıf durum takibi |
| 9 | Otopark | Kağıt bilet / fiş; giriş-çıkış + süre |
| 10 | Çocuk oyun alanı | Giriş saati; süreye göre ücret |
| 11 | Self servis oyun alanları (air hockey vb.) | Süre + kullanım |

---

## Niş ama uygun

| # | Sektör | Not |
|---|--------|-----|
| 12 | Terzi | Sipariş kağıdı; teslim tarihi |
| 13 | Matbaa / baskı | İş kağıdı; parça üretim |
| 14 | Emanet / locker | Kağıt numara sistemi |
| 15 | Kamp alanı / günlük kiralama | Giriş-çıkış yazılır |

---

## Kritik içgörü

- ❌ “Her işletmeye uygun”
- ✅ **“Kağıt kullanan işletmeye uygun”**

Bu çizgide kalınırsa: ürün sade kalır, öğrenmesi ve satışı kolaylaşır.  
Sapılırsa: “her şeyi yapan ama hiçbirini iyi yapmayan” riski.

---

## Roadmap (revize)

### Phase 1 — Launch

- Kafe / restoran
- PlayStation cafe / internet cafe
- Hamam / SPA
- Bilardo / langırt

### Phase 2

- Oto yıkama
- Halı saha
- Otopark

### Phase 3

- Kuru temizleme
- Teknik servis

*(Niş liste ve çocuk oyun alanı gibi kalemler backlog’da şablon önceliğine göre sıraya konur.)*

---

## İmplementasyon notu

- Kod içi **şablon (template) seti** ile bu roadmap paralel ilerler; demoda şu an **Faz 1** şablonları seçilebilir.
- Landing’deki sektör kartları **yol haritası** ve **kapsam dışı** örneklerini eğitim amaçlı gösterebilir; canlı şablon sayısı `template.registry` ile sınırlıdır.
