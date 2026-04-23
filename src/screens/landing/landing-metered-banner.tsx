/**
 * @deprecated Vaha landing şu an yalnızca hamam / sauna / spa dikeyine odaklıdır.
 * Bu bileşen kullanılmıyor; PlayStation / internet cafe segmenti MVP dışında bırakıldı.
 */
import { C, bd, mono, sans } from '@/shared/constants/demo.constants';

export function LandingMeteredBanner() {
  return (
    <div
      style={{
        borderRadius: 12,
        border: bd,
        background: `linear-gradient(135deg, ${C.accentSoft} 0%, ${C.card} 55%, ${C.bg} 100%)`,
        padding: 'clamp(20px, 4vw, 28px)',
        fontFamily: sans,
      }}
    >
      <div style={{ fontSize: 10, fontFamily: mono, letterSpacing: 1.2, color: C.light, marginBottom: 8 }}>
        PLAYSTATION CAFE · İNTERNET CAFE
      </div>
      <h3 style={{ fontSize: 'clamp(17px, 2.5vw, 20px)', fontWeight: 700, color: C.dark, marginBottom: 10, letterSpacing: -0.3 }}>
        Saatlik ücretlendirme, tek yerden
      </h3>
      <p style={{ fontSize: 14, color: C.mid, lineHeight: 1.55, margin: 0, maxWidth: 720 }}>
        Kağıtta kronometre ve fiş yerine: profilde dilim süresini bir kez belirleyin; masa açıldığında sayaç yukarı akar, dilimler otomatik hizmetle
        eşleşir. Sabit paket seçerek süre bitiminde kapatma hatırlatması — demo içinde deneyebilirsiniz.
      </p>
    </div>
  );
}
