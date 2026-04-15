# Execution Checklist

Bu liste, implementasyona gecis sirasini netlestirir.

## Step 1 - Domain iskeleti

- [x] `session.types.ts`: Session, SessionStatus, TimerMode tipleri
- [x] `session.machine.ts`: gecerli status gecis fonksiyonlari
- [x] `pricing.ts`: temel ucret hesaplayici (minute/unit)

## Step 2 - Template contract

- [x] `template.types.ts`: Template contract ve validator
- [x] `internet-cafe.template.ts`
- [x] `ps-cafe.template.ts`
- [x] `spa.template.ts`
- [x] `cafe.template.ts`
- [x] `bilardo.template.ts`

## Step 3 - Template resolver

- [x] sektor secimine gore template secimi
- [x] template fallback mekanizmasi
- [x] bilinmeyen template icin guvenli hata ekrani

## Step 4 - UI entegrasyonu

- [x] session ekraninda action butonlarini template'den uret
- [x] label/terminology map'ini template'den besle
- [x] timer gorunumunu mode'a gore degistir

## Step 5 - Veri ve rapor

- [x] session kayit modelinde template snapshot saklama
- [x] gunluk rapor v1: adet, ciro, ortalama oturum suresi
- [x] edge-case kapsami: yarim kalan odeme, sifir sure, manuel kapama metrikleri

## Step 6 - Pilot hazirlik

- [x] sektor bazli demo seed verisi
- [x] onboarding metinleri (sade dil)
- [x] geri bildirim toplama formati (`docs/04-pilot-feedback-template.md`)

## Step 7 - Resource preset-first akisi

- [ ] sektor bazli hazir kaynak preset dosyalari (hamam anahtar, ps masa/konsol, net pc, kafe masa, bilardo masa)
- [ ] onboarding'de "default kaynaklari yukle" adimi
- [ ] session acilisinda "presetten sec -> gerekirse yeni ekle" UX
- [ ] admin ekranda preset kaynak duzenleme/import-export alani

## Karar noktasi

Implementasyona baslamadan once asagidaki iki secenekten biri secilir:

1. Domain-first:
   - Once `session` ve `template` katmani tamamlanir, sonra UI baglanir.
2. Vertical-slice:
   - Internet Cafe icin uc uca akisi bitir, sonra diger sektorlere cogalt.

Onerilen: **Vertical-slice**, cunku daha erken geri bildirim verir.
