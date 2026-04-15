# Technical Direction

## Mimari omurga

```text
Core Engine (Session + Cart + Timer + Payment State)
        ->
Template Layer (sector config + limited overrides)
        ->
UI Mapping (labels + flow + permissions)
```

## Core domain modeli

### Session state machine (default)

- OPEN
- IN_PROGRESS
- PENDING_PAYMENT
- CLOSED

Template gerekirse bu akisi sinirli sekilde override eder.
Ornek: dry_cleaning akisi "DELIVERED" ile kapanabilir.

### Timer modeli

- `count_up`
- `count_down`
- `no_timer`

### Resource modeli (opsiyonel)

- Masa / cihaz / kabin / oda gibi varliklar.
- Durum: available, occupied, reserved, maintenance.

### Resource preset modeli (MVP kritik)

- Her sektor template'i, "hazir kaynak listesi" ile gelir.
- Ornek:
  - Hamam/SPA: `Anahtar 1..N` veya isme gore kabin listesi
  - PlayStation Cafe: onceden tanimli konsol/masa adlari
  - Internet Cafe: onceden tanimli PC numaralari
  - Kuafor/Berber: onceden tanimli koltuk/istasyon numaralari
- Session acarken varsayilan akis:
  1. Once preset listeden secim
  2. Gerekirse "yeni kaynak ekle"
- Boylesi, tekrar tekrar ayni kaynagi manuel acma ihtiyacini kaldirir.

## Template sistemi v1

Template'ler kod icinde tipli config olarak tutulur (hardcoded).
Amaç: JSONB tabanli dynamic sisteme gecis oncesi kontrollu rollout.

Ornek alanlar:

- `sector`
- `sessionType`
- `resourceName`
- `timer.mode`
- `pricing.type`
- `actions[]`
- `workflow[]` (gerektiginde)
- `resourcePreset[]` (default kaynak listesi)
- `resourceCreationPolicy` (`preset_first`, `allow_manual_after`)

## Veri katmani karari

- Veritabani hedefi: PostgreSQL
- Esneklik: JSONB (template ve sektor ozel alanlar)
- Neden:
  - Transaction guvenligi (odeme, session kapama)
  - Guclu raporlama
  - Esnek schema evrimi

## Teknik guardrails

1. Over-engineering onleme:
   - Sadece ilk 4 sektor icin gereken override hakki verilir.
2. Template kontrolu:
   - Sinirsiz kural motoru yok; "limited override contract" var.
3. UX sadeligi:
   - Her sektor icin ayni ekran degil, ayni cekirdek + sade sektor dili.
4. Kaynak acma disiplini:
   - Varsayilan her zaman "hazir kaynak secimi".
   - Manuel kaynak olusturma sadece ikinci adim olarak acilir.

## Bu repo icin ilk teknik adimlar

1. `src/domain/session` altinda ortak tipler ve state transition fonksiyonlari.
2. `src/templates` altinda sector config dosyalari.
3. `src/features/session` icinde template-driven action renderer.
4. Admin/demo akisinda sektor seciminden template yukleme baglantisi.
