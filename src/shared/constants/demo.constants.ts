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

/** Landing “kimler için” özeti — ürün tek dikey: hamam / sauna / spa */
export const SECTORS: SectorRow[] = [
  {
    id: 'hamam',
    icon: '♨',
    name: 'Hamam · Sauna · Spa',
    desc: 'Kabin/anahtar oturumu, süreli seanslar, ek hizmetler ve tahsilat tek panelde',
    session: 'Kabin / Anahtar',
    unit: 'Hizmet + süre',
    roadmap: 'phase1',
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
    title: 'İşletmeyi tanımlayın',
    desc: 'Şube adı ve oturum etiketinizi netleştirin; ekip aynı dili konuşsun.',
    color: '#f0ece4',
    icon: '◉',
  },
  {
    title: 'Hizmet kataloğunu kurun',
    desc: 'Hamam, sauna, masaj, kafeterya ve paketleri fiyat + süre ile tanımlayın.',
    color: '#e4ecf0',
    icon: '◱',
  },
  {
    title: 'Kabin / anahtar listenizi hazırlayın',
    desc: 'Hazır listeden seçerek açın; yoğun günlerde resepsiyon hızlanır.',
    color: '#e4f0e8',
    icon: '⌂',
  },
  {
    title: 'Oturumu açın',
    desc: 'Kabin veya anahtar bazlı oturum başlatın; sepete hizmet ekleyin.',
    color: '#e8ecf4',
    icon: '◫',
  },
  {
    title: 'Süreyi takip edin',
    desc: 'Seans süresi ve paketler için uyarılarla sahada kaçırma riskini azaltın.',
    color: '#f0e4ec',
    icon: '⏱',
  },
  {
    title: 'Tahsilatı kapatın',
    desc: 'Tek adımda tahsilat; isterseniz POS’a gönderim ile kasa hizası.',
    color: '#ece4f0',
    icon: '◎',
  },
  {
    title: 'Günü raporlayın',
    desc: 'Ciro, yoğunluk ve en çok satan hizmetler — spa işletmesi için özet.',
    color: '#ecf0e4',
    icon: '◩',
  },
];

export const APP_ONBOARD_STEPS = [
  {
    id: 'business',
    title: 'İşletme bilgisi',
    desc: 'Demo şube adı ve oturum etiketini belirleyin.',
  },
  {
    id: 'ready',
    title: 'Başlangıç kurulumu',
    desc: 'Hamam / sauna / spa kataloğu ve kabin listesi örnek verilerle hazır.',
  },
] as const;

export const DEMO_MOBILE_BREAKPOINT = 1024;

export function getTemplatePreset(sectorId: string): TemplatePreset {
  return resolveTemplateBySector(sectorId).preset;
}
