import type { DemoServiceRow, PosDeviceRow, SectorRow, TemplatePreset } from '@/shared/types/demo.types';

export const C = {
  bg: '#fafaf8',
  card: '#ffffff',
  dark: '#111110',
  dark2: '#2a2a28',
  mid: '#6b6b65',
  light: '#b5b5ae',
  border: '#e8e8e4',
  accent: '#1a1a18',
  accentSoft: '#f0f0ec',
  warm: '#e8e4dc',
  green: '#1a8c5b',
  greenSoft: '#e8f5ee',
  red: '#cc3333',
  redSoft: '#fce8e8',
} as const;

export const mono = "'DM Mono', monospace";
export const sans = "'DM Sans', sans-serif";
export const bd = `1px solid ${C.border}`;

export const SECTORS: SectorRow[] = [
  {
    id: 'hamam',
    icon: '♨',
    name: 'Hamam & SPA',
    desc: 'Kabine, hizmet ve paket yönetimi',
    session: 'Kabine / Müşteri',
    unit: 'Hizmet (dk bazlı)',
  },
  {
    id: 'gym',
    icon: '◎',
    name: 'Spor Salonu',
    desc: 'Üyelik, giriş ve ekstra hizmetler',
    session: 'Üye Girişi',
    unit: 'Ders / Ekstra',
  },
  {
    id: 'ps',
    icon: '▶',
    name: 'PlayStation Cafe',
    desc: 'Konsol kiralama ve market satışı',
    session: 'Konsol / Masa',
    unit: 'Saatlik + Ürün',
  },
  {
    id: 'net',
    icon: '◻',
    name: 'İnternet Cafe',
    desc: 'Bilgisayar oturumları ve market',
    session: 'PC No',
    unit: 'Saatlik + Ürün',
  },
  {
    id: 'kuru',
    icon: '◇',
    name: 'Kuru Temizleme',
    desc: 'Sipariş takibi ve teslim yönetimi',
    session: 'Sipariş / Fiş',
    unit: 'Parça bazlı',
  },
  {
    id: 'cafe',
    icon: '◈',
    name: 'Kafe & Restoran',
    desc: 'Masa adisyonu ve menü yönetimi',
    session: 'Masa / Adisyon',
    unit: 'Menü Ürünleri',
  },
  {
    id: 'rent',
    icon: '◐',
    name: 'Saatlik Kiralama',
    desc: 'Alan, oda ve ekipman rezarvasyonu',
    session: 'Rezervasyon',
    unit: 'Saat / Slot',
  },
  {
    id: 'kuafor',
    icon: '✂',
    name: 'Kuaför & Berber',
    desc: 'Randevu ve personel yönetimi',
    session: 'Randevu',
    unit: 'Hizmet (dk bazlı)',
  },
];

export const DEMO_SERVICES: DemoServiceRow[] = [
  { id: 1, cat: 'hamam', name: 'Klasik Hamam', price: 350, dur: 45 },
  { id: 2, cat: 'hamam', name: 'Köpük Masajı', price: 280, dur: 30 },
  { id: 3, cat: 'hamam', name: 'Kese', price: 180, dur: 20 },
  { id: 4, cat: 'hamam', name: 'Kese + Köpük', price: 420, dur: 45 },
  { id: 5, cat: 'sauna', name: 'Fin Saunası', price: 250, dur: 60 },
  { id: 6, cat: 'sauna', name: 'Buhar Odası', price: 200, dur: 40 },
  { id: 7, cat: 'masaj', name: 'Klasik Masaj', price: 450, dur: 60 },
  { id: 8, cat: 'masaj', name: 'Aromatik Masaj', price: 520, dur: 60 },
  { id: 9, cat: 'kafeterya', name: 'Bitki Çayı', price: 45, dur: 0 },
  { id: 10, cat: 'kafeterya', name: 'Meyve Tabağı', price: 85, dur: 0 },
  { id: 11, cat: 'kafeterya', name: 'Kahve', price: 55, dur: 0 },
  { id: 12, cat: 'paket', name: 'Kraliyet Paketi', price: 950, dur: 120 },
];

export const POS_DEVICES: PosDeviceRow[] = [
  { id: 'p1', name: 'Resepsiyon', loc: 'Giriş', st: 'online' },
  { id: 'p2', name: 'Hamam Kabini', loc: 'Hamam Katı', st: 'online' },
  { id: 'p3', name: 'Sauna Çıkışı', loc: 'Sauna Katı', st: 'busy' },
  { id: 'p4', name: 'Kafeterya', loc: 'Kafeterya', st: 'online' },
  { id: 'p5', name: 'Masaj Odası', loc: 'Masaj Katı', st: 'offline' },
];

export const WEEKLY = [
  { d: 'Pzt', v: 98 },
  { d: 'Sal', v: 112 },
  { d: 'Çar', v: 145 },
  { d: 'Per', v: 128 },
  { d: 'Cum', v: 198 },
  { d: 'Cmt', v: 243 },
  { d: 'Paz', v: 220 },
];

export const ONBOARD_STEPS = [
  {
    title: 'İş modelinizi seçin',
    desc: 'Ön tanımlı şablonlardan size en yakın olanı seçin. Terimler, etiketler ve akış, seçtiğiniz alışkanlığa göre kendiliğinden yerleşir.',
    color: '#f0ece4',
    icon: '◉',
  },
  {
    title: 'Menünüzü gruplayın',
    desc: 'Kategoriler; menünüzün veya hizmet listenizin iskeletidir. Önce başlıkları kurun, her şey düzenli ve genişlemeye açık kalsın.',
    color: '#e4ecf0',
    icon: '◱',
  },
  {
    title: 'Teklifinizi oluşturun',
    desc: 'Ürün ve hizmetleri fiyat, süre ve vergiyle kaydedin. Bir kez tanımlanan kalem, hem sepette hem raporda tutarlı görünür.',
    color: '#e4f0e8',
    icon: '▤',
  },
  {
    title: 'Kasaları bağlayın',
    desc: 'POS ile çalışan her kasa noktasını tanımlayın. Hangi cihazın hazır, hangisinin yoğun olduğunu tek bakışta görün.',
    color: '#ece4f0',
    icon: '⬡',
  },
  {
    title: 'Adisyonu açın',
    desc: 'Kabine, masa veya oturuma göre kayıt başlatıp kalemleri ekleyin. Süre sayaçları sessizce işler, siz işinize bakarsınız.',
    color: '#e8ecf4',
    icon: '◫',
  },
  {
    title: 'Tahsilatı kapatın',
    desc: 'Ödemeyi panelden veya POS üzerinden tamamlayın. İşlem kapanır kapanmaz durum güncellenir, iz sürülebilir kalır.',
    color: '#f0e4ec',
    icon: '◎',
  },
  {
    title: 'Performansı görün',
    desc: 'Ciro, doluluk ve en çok dönen ürünlerle gününü ve döneminizi ölçün. Neyin işe yaradığını veriye dayanarak keşfedin.',
    color: '#ecf0e4',
    icon: '◩',
  },
];

export const APP_ONBOARD_STEPS = [
  {
    id: 'sector',
    title: 'Sektör seçimi',
    desc: 'Terminoloji ve varsayılan şablonları otomatik yükleyelim.',
  },
  {
    id: 'business',
    title: 'İşletme bilgisi',
    desc: 'Demo işletme adı ve oturum etiketini belirleyin.',
  },
  {
    id: 'ready',
    title: 'Başlangıç kurulumu',
    desc: 'Hizmetler, kategoriler ve kaynaklar örnek verilerle hazır.',
  },
] as const;

const TEMPLATE_PRESETS_RECORD: Record<string, Omit<TemplatePreset, never>> = {
  hamam: {
    sessionLabel: 'Kabine / Müşteri',
    resourceLabel: 'Kabine',
    categories: [
      { k: 'hamam', l: 'Hamam' },
      { k: 'sauna', l: 'Sauna' },
      { k: 'masaj', l: 'Masaj' },
      { k: 'kafeterya', l: 'Kafeterya' },
      { k: 'paket', l: 'Paketler' },
    ],
    services: DEMO_SERVICES,
  },
  ps: {
    sessionLabel: 'Konsol / Masa',
    resourceLabel: 'Konsol',
    categories: [
      { k: 'konsol', l: 'Konsol' },
      { k: 'market', l: 'Market' },
      { k: 'paket', l: 'Paket' },
    ],
    services: [
      { id: 101, cat: 'konsol', name: 'PS5 1 Saat', price: 170, dur: 60 },
      { id: 102, cat: 'konsol', name: 'PS5 VIP 1 Saat', price: 230, dur: 60 },
      { id: 103, cat: 'market', name: 'Enerji İçeceği', price: 65, dur: 0 },
      { id: 104, cat: 'market', name: 'Cips', price: 45, dur: 0 },
      { id: 105, cat: 'paket', name: '3 Saat Turnuva Paketi', price: 420, dur: 180 },
    ],
  },
  cafe: {
    sessionLabel: 'Masa / Adisyon',
    resourceLabel: 'Masa',
    categories: [
      { k: 'icecek', l: 'İçecek' },
      { k: 'yiyecek', l: 'Yiyecek' },
      { k: 'tatli', l: 'Tatlı' },
    ],
    services: [
      { id: 201, cat: 'icecek', name: 'Latte', price: 110, dur: 0 },
      { id: 202, cat: 'icecek', name: 'Filtre Kahve', price: 95, dur: 0 },
      { id: 203, cat: 'yiyecek', name: 'Club Sandviç', price: 180, dur: 0 },
      { id: 204, cat: 'tatli', name: 'San Sebastian', price: 165, dur: 0 },
    ],
  },
};

export const DEMO_MOBILE_BREAKPOINT = 1024;

export function getTemplatePreset(sectorId: string): TemplatePreset {
  const preset = TEMPLATE_PRESETS_RECORD[sectorId] ?? TEMPLATE_PRESETS_RECORD.hamam;
  return {
    ...preset,
    categories: preset.categories.map((c) => ({ ...c })),
    services: preset.services.map((s) => ({ ...s })),
  };
}
