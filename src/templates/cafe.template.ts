import type { SectorTemplate } from '@/templates/template.types';

/** Kafe / restoran — masa adisyonu, süre zorunlu değil (no_timer). */
export const cafeTemplate: SectorTemplate = {
  id: 'cafe-v1',
  sector: 'cafe',
  sessionType: 'resource_session',
  resourceName: 'Masa',
  resourcePreset: ['Masa 1', 'Masa 2', 'Masa 3', 'Masa 4', 'Masa 5', 'Bahçe 1', 'Bahçe 2'],
  timer: {
    mode: 'no_timer',
  },
  pricing: {
    type: 'flat',
  },
  labels: {
    session: 'Masa Adisyonu',
    resource: 'Masa',
    sessionsNav: 'MASALAR',
    addServiceCta: 'Ürün Ekle',
    closeSessionCta: 'Hesabı Kapat',
  },
  actions: ['add_service', 'change_qty', 'close_session', 'send_to_pos'],
  workflow: [
    { from: 'open', to: 'in_progress' },
    { from: 'in_progress', to: 'pending_payment' },
    { from: 'pending_payment', to: 'closed' },
  ],
  categories: [
    { k: 'sicak', l: 'Sıcak İçecek' },
    { k: 'yiyecek', l: 'Yiyecek' },
    { k: 'tatli', l: 'Tatlı' },
  ],
  services: [
    { id: 301, cat: 'sicak', name: 'Filtre Kahve', price: 85, dur: 0 },
    { id: 302, cat: 'sicak', name: 'Çay', price: 35, dur: 0 },
    { id: 303, cat: 'yiyecek', name: 'Tost', price: 120, dur: 0 },
    { id: 304, cat: 'yiyecek', name: 'Sandviç', price: 145, dur: 0 },
    { id: 305, cat: 'tatli', name: 'Cheesecake', price: 165, dur: 0 },
  ],
};
