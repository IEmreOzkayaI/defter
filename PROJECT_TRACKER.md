# Vaha - proje takip notlari

## Bu proje ne?

Vaha; hamam / sauna / spa isletmeleri icin **saha operasyonu** (kabin/anahtar oturumu, hizmet kalemleri, sure, tahsilat, istege bagli POS) odakli bir demo + landing urunudur.

## Akis (frontend)

1. Landing (`/`)
2. Demo plan secimi (modal) → `/demo/onboarding/temel` veya `/demo/onboarding/pos`
3. Onboarding: isletme bilgisi + hazir spa sablonu ozeti
4. Demo app: oturumlar / analiz / hizmetler + profil

Notlar:

- Demo dikeyi tek: `hamam` sablonu (`src/templates/spa.template.ts`).
- Eski coklu-sektor template dosyalari kaldirildi; registry tek kayit.

## SEO

- Yer tutucu domain: `vaha.app` (`index.html`, `public/sitemap.xml`, `public/robots.txt`).
- JSON-LD + SSS: `src/shared/seo/*`

## Siradaki isler (kisa backlog)

- Online rezervasyon kanali (musteri tarafi) ve admin takvim
- Personel / vardiya ve oda uygunluk (availability)
- Gercek POS entegrasyonlari (odeme sonucu callback)
