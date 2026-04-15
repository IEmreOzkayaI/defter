import type { SectorTemplate } from '@/templates/template.types';

export const internetCafeTemplate: SectorTemplate = {
  id: 'internet-cafe-v1',
  sector: 'net',
  sessionType: 'resource_session',
  resourceName: 'PC',
  resourcePreset: ['PC 1', 'PC 2', 'PC 3', 'PC 4', 'PC 5', 'PC 6', 'PC 7', 'PC 8'],
  timer: {
    mode: 'count_up',
  },
  pricing: {
    type: 'per_minute',
    unitPrice: 3,
  },
  labels: {
    session: 'PC Oturumu',
    resource: 'PC',
    sessionsNav: "PC'LER",
    addServiceCta: 'Ürün Ekle',
    closeSessionCta: 'Hesabı Kapat',
  },
  actions: ['add_service', 'change_qty', 'close_session'],
  workflow: [
    { from: 'open', to: 'in_progress' },
    { from: 'in_progress', to: 'pending_payment' },
    { from: 'pending_payment', to: 'closed' },
  ],
  categories: [
    { k: 'oturum', l: 'Oturum' },
    { k: 'market', l: 'Market' },
    { k: 'paket', l: 'Paket' },
  ],
  services: [
    { id: 1, cat: 'oturum', name: 'Standart PC Saat', price: 120, dur: 60 },
    { id: 2, cat: 'oturum', name: 'Gaming PC Saat', price: 180, dur: 60 },
    { id: 3, cat: 'market', name: 'Soğuk İçecek', price: 45, dur: 0 },
    { id: 4, cat: 'market', name: 'Atıştırmalık', price: 55, dur: 0 },
    { id: 5, cat: 'paket', name: '5 Saat Paket', price: 520, dur: 300 },
  ],
};
