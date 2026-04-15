/** Oturum listesi sekmesi: şablon kaynak etiketi + sektöre göre (sabit "MASALAR" yok). */
export function getSessionsNavLabel(resourceLabel: string, sectorId: string): string {
  const lower = (resourceLabel || '').toLowerCase();
  if (/masa|adisyon/.test(lower)) return 'MASALAR';
  if (/kabine|müşteri|musteri|spa/.test(lower)) return 'KABİNELER';
  if (/konsol|playstation|ps/.test(lower)) return 'KONSOLLAR';
  if (/pc|bilgisayar|no\b/.test(lower)) return "PC'LER";
  if (/sipariş|siparis|fiş|fis|kuru/.test(lower)) return 'SİPARİŞLER';
  if (/rezervasyon|alan|oda|saatlik kiralama/.test(lower)) return 'REZERVASYONLAR';
  if (/koltuk|istasyon/.test(lower)) return 'KOLTUKLAR';
  if (/randevu|kuaför|berber/.test(lower)) return 'RANDEVULAR';
  if (/üye|uye|spor|gym|giriş|giris/.test(lower)) return 'GİRİŞLER';
  const bySector: Record<string, string> = {
    hamam: 'KABİNELER',
    gym: 'GİRİŞLER',
    ps: 'KONSOLLAR',
    net: "PC'LER",
    kuru: 'SİPARİŞLER',
    cafe: 'MASALAR',
    rent: 'REZERVASYONLAR',
    bilardo: 'MASALAR',
  };
  if (sectorId && bySector[sectorId]) return bySector[sectorId];
  return 'OTURUMLAR';
}
