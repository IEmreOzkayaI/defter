/** Statik landing içerikleri — kopya güncellemeleri tek yerden. */

export const LANDING_HERO_BENEFITS = [
  {
    t: 'Resepsiyon hızlanır',
    d: 'Açık oturum ve sepet tek ekranda; “bu masa kapandı mı?” netleşir.',
  },
  {
    t: 'Kapanmayan hesap azalır',
    d: 'Tahsilat adımı ve (isteğe bağlı) POS hizası demo ile görülür.',
  },
  {
    t: 'Kısa eğitim',
    d: 'Kağıttaki aç–kapat mantığı korunur; ekip hızlı adapte olur.',
  },
] as const;

export const LANDING_HERO_PILLS = ['Kabin oturumu', 'Hizmet sepeti', 'Süre + tahsilat'] as const;

export const LANDING_SESSION_STATS = [
  { v: '30 sn', l: 'ilk kayıt' },
  { v: '1 gün', l: 'alışma süresi' },
  { v: '∞', l: 'işlem kaydı' },
] as const;

export const LANDING_QUICK_QA: { q: string; a: string }[] = [
  { q: 'Kurulum zor mu?', a: 'Hayır. Demo verilerle açıp aynı gün deneyebilirsiniz.' },
  { q: 'Ekip zorlanır mı?', a: 'Kağıttaki “aç-kapat” mantığı korunur; eğitim süresi kısa kalır.' },
  { q: 'Sadece hamam mı?', a: 'Hayır. Hamam + sauna + masaj + kafeterya/paket kalemleri aynı panelde.' },
];

export const LANDING_FEATURES: { icon: string; title: string; desc: string }[] = [
  { icon: '⌂', title: 'Kabin / anahtar listesi', desc: 'Hazır listeden hızlı aç; yoğun günde resepsiyon hızlanır.' },
  { icon: '▤', title: 'Hizmet kataloğu', desc: 'Hamam, sauna, masaj, kafeterya ve paket kalemleri; fiyat + süre ile yönetim.' },
  { icon: '◫', title: 'Oturum + sepet', desc: 'Açık oturumda kalemler, miktar ve toplam; kapanışta tahsilat akışı.' },
  { icon: '◎', title: 'Durum akışı', desc: 'OPEN → IN_PROGRESS → PENDING_PAYMENT → CLOSED ile net süreç; Dene turunda görünür.' },
  { icon: '⏱', title: 'Süre takibi', desc: 'Seans süresi ve paketler için uyarı yaklaşımı (demo mantığı).' },
  { icon: '◩', title: 'Gün sonu özeti', desc: 'Kapalı ciro, açık tahmini ve en çok satan kalemler — demo verilerle örnek.' },
  { icon: '⬡', title: 'POS (isteğe bağlı)', desc: 'Temel + POS demosunda cihaz seçimi ve gönderim akışı.' },
  { icon: '◳', title: 'Responsive', desc: 'Masaüstü ve mobil; demo akışı tek ekranda.' },
];
