import type { SectorTemplate } from '@/templates/template.types';

export const psCafeTemplate: SectorTemplate = {
  id: 'ps-cafe-v1',
  sector: 'ps',
  sessionType: 'resource_session',
  resourceName: 'Konsol',
  resourcePreset: ['Masa 1', 'Masa 2', 'Masa 3', 'Masa 4', 'VIP Masa 1', 'VIP Masa 2'],
  timer: {
    mode: 'count_up',
  },
  pricing: {
    type: 'per_minute',
    unitPrice: 4,
  },
  labels: {
    session: 'Konsol Oturumu',
    resource: 'Konsol',
    sessionsNav: 'KONSOLLAR',
    addServiceCta: 'Ürün Ekle',
    closeSessionCta: 'Çeki Kapat',
  },
  actions: ['add_service', 'change_qty', 'close_session'],
  workflow: [
    { from: 'open', to: 'in_progress' },
    { from: 'in_progress', to: 'pending_payment' },
    { from: 'pending_payment', to: 'closed' },
  ],
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
};
