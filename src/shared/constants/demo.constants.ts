import type { DemoServiceRow, PosDeviceRow, SectorRow, TemplatePreset } from '@/shared/types/demo.types';
import { resolveTemplateBySector } from '@/templates/template.resolver';

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

/** Landing sektör ızgarası — roadmap: `docs/05-product-scope-and-roadmap.md` */
export const SECTORS: SectorRow[] = [
  // Faz 1 — launch (demoda şablon seçilebilir)
  {
    id: 'cafe',
    icon: '◈',
    name: 'Kafe & Restoran',
    desc: 'Masa aç → ürün yaz → hesap al → kapat',
    session: 'Masa / Adisyon',
    unit: 'Menü',
    roadmap: 'phase1',
  },
  {
    id: 'ps',
    icon: '▶',
    name: 'PlayStation Cafe',
    desc: 'Konsol + süre + market; kağıt ve kronometre yerine',
    session: 'Konsol / Masa',
    unit: 'Saatlik + ürün',
    roadmap: 'phase1',
  },
  {
    id: 'net',
    icon: '◻',
    name: 'İnternet Cafe',
    desc: 'PC oturumu, dilimli ücret, market',
    session: 'PC No',
    unit: 'Saatlik + ürün',
    roadmap: 'phase1',
  },
  {
    id: 'hamam',
    icon: '♨',
    name: 'Hamam / SPA',
    desc: 'Kabin aç → hizmet yaz → süre takibi',
    session: 'Kabine',
    unit: 'Hizmet (dk)',
    roadmap: 'phase1',
  },
  {
    id: 'bilardo',
    icon: '●',
    name: 'Bilardo / Langırt',
    desc: 'Masa aç → süre + içecek',
    session: 'Masa',
    unit: 'Süre + ürün',
    roadmap: 'phase1',
  },
  // Faz 2
  {
    id: 'oto-yikama',
    icon: '🚗',
    name: 'Oto Yıkama',
    desc: 'Araç gelir → işlemler fişe yazılır',
    session: 'Araç / plaka',
    unit: 'Kalem bazlı',
    roadmap: 'phase2',
  },
  {
    id: 'halisaha',
    icon: '⚽',
    name: 'Halı Saha',
    desc: 'Saha + saat; defter yerine ekran',
    session: 'Saha / slot',
    unit: 'Saatlik',
    roadmap: 'phase2',
  },
  {
    id: 'otopark',
    icon: '▣',
    name: 'Otopark',
    desc: 'Giriş-çıkış, süre ve ücret',
    session: 'Plaka / bilet',
    unit: 'Saatlik / günlük',
    roadmap: 'phase2',
  },
  // Faz 3
  {
    id: 'kuru',
    icon: '◇',
    name: 'Kuru Temizleme',
    desc: 'Fiş + “teslim edildi mi?” takibi',
    session: 'Sipariş / fiş',
    unit: 'Parça',
    roadmap: 'phase3',
  },
  {
    id: 'teknik-servis',
    icon: '🔧',
    name: 'Teknik Servis',
    desc: 'Servis fişi ve durum hattı',
    session: 'Cihaz / fiş',
    unit: 'İşçilik + parça',
    roadmap: 'phase3',
  },
  // Niş
  {
    id: 'cocuk-oyun',
    icon: '◉',
    name: 'Çocuk Oyun Alanı',
    desc: 'Giriş saati → süreye göre ücret',
    session: 'Çocuk / bileklik',
    unit: 'Dk / paket',
    roadmap: 'niche',
  },
  {
    id: 'self-oyun',
    icon: '▫',
    name: 'Self Servis Oyun',
    desc: 'Air hockey vb. süre + kullanım',
    session: 'Masa / makine',
    unit: 'Süre',
    roadmap: 'niche',
  },
  {
    id: 'terzi',
    icon: '📐',
    name: 'Terzi',
    desc: 'Sipariş kağıdı, teslim tarihi',
    session: 'Sipariş',
    unit: 'İş kalemi',
    roadmap: 'niche',
  },
  {
    id: 'matbaa',
    icon: '🖨',
    name: 'Matbaa / Baskı',
    desc: 'İş kartı, parça üretim',
    session: 'İş emri',
    unit: 'Adet / iş',
    roadmap: 'niche',
  },
  {
    id: 'emanet',
    icon: '🔐',
    name: 'Emanet / Locker',
    desc: 'Numara fişi ve teslim',
    session: 'Dolap no',
    unit: 'Süre / günlük',
    roadmap: 'niche',
  },
  {
    id: 'kamp',
    icon: '⛺',
    name: 'Kamp / Günlük Kiralama',
    desc: 'Giriş-çıkış ve konaklama notu',
    session: 'Birim / çadır',
    unit: 'Gecelik',
    roadmap: 'niche',
  },
  {
    id: 'rent',
    icon: '◐',
    name: 'Saatlik Kiralama',
    desc: 'Alan, oda, ekipman slotu',
    session: 'Rezervasyon',
    unit: 'Saat',
    roadmap: 'niche',
  },
  // Kapsam dışı örnekler (CRM / booking — Defter değil)
  {
    id: 'gym',
    icon: '◎',
    name: 'Spor Salonu (üyelik)',
    desc: 'Üyelik ve CRM ağırlıklı model — ayrı ürün',
    session: 'Üye',
    unit: 'Üyelik',
    roadmap: 'out',
  },
  {
    id: 'kuafor',
    icon: '✂',
    name: 'Kuaför (randevu-first)',
    desc: 'Randevu takvimi ağırlıklı — booking uygulaması',
    session: 'Randevu',
    unit: 'Hizmet',
    roadmap: 'out',
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

export const DEMO_MOBILE_BREAKPOINT = 1024;

export function getTemplatePreset(sectorId: string): TemplatePreset {
  return resolveTemplateBySector(sectorId).preset;
}
