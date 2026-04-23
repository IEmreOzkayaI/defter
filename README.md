# Vaha (frontend)

Hamam, sauna ve spa isletmeleri icin sade bir operasyon paneli (demo + landing). Bu klasor Vite + React uygulamasidir.

## Hizli baslangic

```bash
pnpm install
pnpm dev
```

## SEO / alan adi notu

- Statik yer tutucu alan: `https://vaha.app` (`index.html`, `public/sitemap.xml`, `public/robots.txt`).
- Calisma aninda canonical ve `og:url` icin landing `window.location.origin` kullanir.
- `VITE_SITE_URL` bos ise JSON-LD fallback olarak `https://vaha.app` kullanilir (`src/shared/seo/site-config.ts`).

## Runtime API URL (Docker)

- Uretimde API adresi `public/env-config.js` ile enjekte edilir (`entrypoint.sh`).
- Yeni anahtar: `window.__VAHA_RUNTIME_CONFIG__` (eski `window.__DEFTER_RUNTIME_CONFIG__` geriye donuk olarak da set edilir).

## Demo

- `/demo/onboarding/*` → `/demo/app/*`
- Demo dikeyi tek: **hamam / sauna / spa** (sektor secimi yok).

## Dokumantasyon

Urun kararlari: `docs/README.md`
