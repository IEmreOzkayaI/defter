# Technical direction (Vaha)

## Mimari omurga

```text
Session + Cart + Timer + Payment state (core)
        ->
Template (spa sablonu: etiketler, kategoriler, aksiyonlar)
        ->
UI (demo + landing)
```

## Template yaklasimi (bugun)

- Template kod icinde tipli config (`src/templates/spa.template.ts`).
- Registry tek kayit: `hamam` → spa template (`src/templates/template.registry.ts`).
- Amaç: once tek dikeyde olgunlas, sonra JSON/config genislemesine gec.

## Core guardrails

1. **Sadelik:** ayni ekranlar; spa terminolojisi.
2. **Preset-first kaynak:** kabin/anahtar listesi hazir gelsin.
3. **Sinirli state machine:** OPEN → IN_PROGRESS → PENDING_PAYMENT → CLOSED.
4. **Timer:** `count_down` / `count_up` / `no_timer` (sablon secimi).

## Repo ici notlar

- Demo verisi `src/shared/constants/demo.constants.ts` icinde.
- Uretim API URL: runtime `env-config.js` (`__VAHA_RUNTIME_CONFIG__`).
