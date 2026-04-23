import type { SectorTemplate } from '@/templates/template.types';

export const spaTemplate: SectorTemplate = {
  id: 'spa-v1',
  sector: 'hamam',
  sessionType: 'resource_session',
  resourceName: 'Kabin',
  resourcePreset: ['Kabin 1', 'Kabin 2', 'Kabin 3', 'Kabin 4', 'Kabin 5', 'Kabin 6'],
  timer: {
    mode: 'count_down',
    defaultDurationMin: 60,
  },
  pricing: {
    type: 'flat',
  },
  labels: {
    session: 'Kabin oturumu',
    resource: 'Kabin',
    sessionsNav: 'İşlemler',
    addServiceCta: 'Hizmet ekle',
    closeSessionCta: 'Tahsil et ve kapat',
  },
  actions: ['add_service', 'change_qty', 'close_session', 'send_to_pos'],
  workflow: [
    { from: 'open', to: 'in_progress' },
    { from: 'in_progress', to: 'pending_payment' },
    { from: 'pending_payment', to: 'closed' },
  ],
  categories: [
    { k: 'hamam', l: 'Hamam' },
    { k: 'sauna', l: 'Sauna' },
    { k: 'masaj', l: 'Masaj' },
    { k: 'kafeterya', l: 'Kafeterya' },
    { k: 'paket', l: 'Paketler' },
  ],
  services: [
    { id: 201, cat: 'hamam', name: 'Klasik Hamam', price: 350, dur: 45 },
    { id: 202, cat: 'hamam', name: 'Köpük Masajı', price: 280, dur: 30 },
    { id: 203, cat: 'sauna', name: 'Fin Saunası', price: 250, dur: 60 },
    { id: 204, cat: 'masaj', name: 'Aromatik Masaj', price: 520, dur: 60 },
    { id: 205, cat: 'kafeterya', name: 'Bitki Çayı', price: 45, dur: 0 },
    { id: 206, cat: 'paket', name: 'Kraliyet Paketi', price: 950, dur: 120 },
  ],
};
