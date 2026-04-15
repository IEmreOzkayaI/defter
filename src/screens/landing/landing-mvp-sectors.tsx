import { useEffect, useMemo, useState } from 'react';

import { C, bd, mono, sans } from '@/shared/constants/demo.constants';
import type { SectorRoadmap } from '@/shared/types/demo.types';

export interface SectorPreview {
  id: string;
  icon: string;
  name: string;
  desc: string;
  session: string;
  unit: string;
  roadmap?: SectorRoadmap;
}

const PRIORITY_IDS = ['cafe', 'ps', 'net', 'hamam', 'bilardo', 'kuru', 'otopark'];

export function LandingMvpSectors({
  sectors,
  selectedSectorId,
  onSelectSector,
}: {
  sectors: SectorPreview[];
  selectedSectorId?: string;
  onSelectSector?: (sectorId: string) => void;
}) {
  const selectable = useMemo(() => {
    const allowed = sectors.filter((sector) => sector.roadmap !== 'out');
    const byPriority = PRIORITY_IDS.map((id) => allowed.find((sector) => sector.id === id)).filter(Boolean) as SectorPreview[];
    if (byPriority.length > 0) return byPriority;
    return allowed.slice(0, 7);
  }, [sectors]);
  const [internalSelectedId, setInternalSelectedId] = useState<string>(selectable[0]?.id ?? '');
  const activeSectorId = selectedSectorId ?? internalSelectedId;
  const selected = selectable.find((sector) => sector.id === activeSectorId) ?? selectable[0];
  const showMeteredTip = selected && (selected.id === 'ps' || selected.id === 'net');

  useEffect(() => {
    if (!selectable.length) return;
    const hasActive = selectable.some((sector) => sector.id === activeSectorId);
    if (!hasActive) {
      const firstId = selectable[0].id;
      setInternalSelectedId(firstId);
      onSelectSector?.(firstId);
    }
  }, [activeSectorId, onSelectSector, selectable]);

  if (!selected) return null;

  return (
    <div style={{ border: bd, borderRadius: 14, padding: 'clamp(16px,3vw,24px)', background: C.card }}>
      <div style={{ fontSize: 10, color: C.light, letterSpacing: 1.3, fontFamily: mono, marginBottom: 10 }}>
        NE İŞ YAPIYORSUNUZ?
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {selectable.map((sector) => {
          const active = sector.id === selected.id;
          return (
            <button
              key={sector.id}
              type="button"
              onClick={() => {
                setInternalSelectedId(sector.id);
                onSelectSector?.(sector.id);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: 999,
                border: active ? `1px solid ${C.dark}` : `1px solid ${C.border}`,
                background: active ? C.dark : C.bg,
                color: active ? '#fff' : C.mid,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all .2s',
                fontFamily: sans,
              }}
            >
              {sector.name}
            </button>
          );
        })}
      </div>

      <div className="sc" style={{ border: bd, borderRadius: 12, padding: 18, background: C.bg }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: C.accentSoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            {selected.icon}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.dark }}>{selected.name}</div>
            <div style={{ fontSize: 12, color: C.mid }}>{selected.desc}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
          {[
            ['KAYIT', selected.session],
            ['BİRİM', selected.unit],
          ].map(([label, value]) => (
            <div key={label} style={{ padding: '10px 12px', borderRadius: 8, background: C.card, border: bd }}>
              <div style={{ fontSize: 9, color: C.light, fontFamily: mono, letterSpacing: 0.6, marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{value}</div>
            </div>
          ))}
        </div>

        {showMeteredTip && (
          <div style={{ marginTop: 10, borderRadius: 8, background: C.accentSoft, padding: '9px 11px' }}>
            <div style={{ fontSize: 12, color: C.mid, lineHeight: 1.5 }}>
              Bu modelde sayaç ve dilim otomatik işler; süre elle takip derdi ortadan kalkar.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
