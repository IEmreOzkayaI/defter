import type { SectorTemplate } from '@/templates/template.types';

/** Bilardo / langırt — masa + süre + içecek (PS cafe ile aynı motor). */
export const bilardoTemplate: SectorTemplate = {
  id: 'bilardo-v1',
  sector: 'bilardo',
  sessionType: 'resource_session',
  resourceName: 'Masa',
  resourcePreset: ['Masa 1', 'Masa 2', 'Masa 3', 'Masa 4', 'Langırt 1', 'Langırt 2'],
  timer: {
    mode: 'count_up',
  },
  pricing: {
    type: 'per_minute',
    unitPrice: 3,
  },
  labels: {
    session: 'Masa Oturumu',
    resource: 'Masa',
    sessionsNav: 'MASALAR',
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
    { k: 'masa', l: 'Masa ücreti' },
    { k: 'icecek', l: 'İçecek' },
    { k: 'atistirmalik', l: 'Atıştırmalık' },
  ],
  services: [
    { id: 401, cat: 'masa', name: 'Standart saat ücreti (dilim)', price: 180, dur: 60 },
    { id: 402, cat: 'icecek', name: 'Kola', price: 60, dur: 0 },
    { id: 403, cat: 'icecek', name: 'Ayran', price: 45, dur: 0 },
    { id: 404, cat: 'atistirmalik', name: 'Cips', price: 50, dur: 0 },
  ],
};
