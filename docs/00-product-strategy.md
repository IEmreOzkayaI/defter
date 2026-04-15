# Product Strategy

## Ürün pozisyonlaması (daraltılmış)

**Defter**, kağıt adisyon, fiş ve iş takip defteri kullanan işletmelerin **dijital karşılığıdır** — “her işletmeye uygun” değil, **“kağıt kullanan işletmeye uygun”**.

Öz: **adisyon + işlem takibi + süre/ürün yazılan dijital defter**.  
Akış: **işlem aç → içine yaz → süreçte tut → kapat**.

### Bilinçli olarak dışarıda (Defter değil)

- Randevu-first işler (ör. psikolog, diyetisyen, randevu ağırlıklı kuaför)
- CRM / üyelik ağırlıklı işler (ör. klasik spor salonu üyelik modeli)
- Danışmanlık ve eğitim yönetim sistemleri

👉 Bunlar **booking / CRM** ürünleridir; Defter’in çekirdeği buna genişletilmez.

### Golden rule (yeni sektör filtresi)

Yeni şablon veya sektör eklerken:

1. Bugün **kağıda** yazıyor mu?
2. **Açık işlemleri** gözle takip ediyor mu?
3. **“Bu hesap kapanmış mı?”** problemi var mı?

Üçü de evet → aday. Hayır ağırlıklı → ekleme.

### Stratejik ilkeler (teknik)

1. **Progressive complexity:** İlk kurulum basit; derin özellikler kullanımla açılır.
2. **Core sabit, şablon değişken:** Session / sepet / süre çekirdeği ortak; template katmanı dil ve kaynak listesini uyarır.
3. **Hazır kaynak:** Çoğu işletmede kaynaklar sabit; listeden seç, gerekirse sonra ekle.
4. **Online-first:** MVP’de hızlı teslim; offline-lite sonraki faz.
5. **Monetizasyon:** Core yıllık paket; POS isteğe bağlı.

### Roadmap özeti

| Faz | İçerik |
|-----|--------|
| **Faz 1 (launch)** | Kafe/restoran, PS cafe, internet cafe, hamam/SPA, bilardo/langırt |
| **Faz 2** | Oto yıkama, halı saha, otopark |
| **Faz 3** | Kuru temizleme, teknik servis |

Niş ve ek sektörler (terzi, matbaa, emanet, kamp vb.) backlog’da şablon önceliğine göre sıralanır.

Detaylı liste ve “kapsam dışı” örnekler: `docs/05-product-scope-and-roadmap.md`.

## MVP kapsamı (teknik)

### Dahil

- Oturum CRUD, sepet, hazır kaynak seçimi
- Timer varyantları (count_up, count_down, no_timer)
- Şablon v1 (kod içi registry)
- Günlük rapor özeti
- Demo: Faz 1 şablonları seçilebilir

### Harici (bilinçli)

- Tam randevu / üyelik CRM
- Multi-branch, gelişmiş analitik
- Offline mode (ilk MVP)

## Başarı kriterleri (ilk 90 gün)

- Faz 1 şablonları stabil ve pilot kullanılabilir.
- Onboarding tamamlama oranı hedefi korunur.
- Oturum kapama hatası düşük düzeyde.
- Ürün mesajı “kağıt adisyon” çizgisinde netleşir.
