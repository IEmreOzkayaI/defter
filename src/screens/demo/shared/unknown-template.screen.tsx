import { C, sans } from '@/shared/constants/demo.constants';

interface UnknownTemplateScreenProps {
  sectorId: string;
  onBack: () => void;
}

export default function UnknownTemplateScreen({ sectorId, onBack }: UnknownTemplateScreenProps) {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: C.bg,
        fontFamily: sans,
        padding: 16,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          background: C.card,
          border: `2px solid ${C.dark}`,
          borderRadius: 12,
          padding: 20,
        }}
      >
        <div style={{ fontSize: 12, color: C.light, marginBottom: 8 }}>TEMPLATE HATASI</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.dark, marginBottom: 8 }}>
          Sektor sablonu bulunamadi
        </div>
        <div style={{ fontSize: 14, color: C.mid, marginBottom: 16, lineHeight: 1.5 }}>
          `"{sectorId}"` sektoru icin uygun bir template kaydi yok. Lutfen onboarding ekranindan
          desteklenen sektorlerden birini secip tekrar deneyin.
        </div>
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: '10px 14px',
            borderRadius: 6,
            border: 'none',
            background: C.dark,
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Onboardinge Don
        </button>
      </div>
    </div>
  );
}
