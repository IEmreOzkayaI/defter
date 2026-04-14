import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  APP_ONBOARD_STEPS,
  C,
  bd,
  getTemplatePreset,
  mono,
  sans,
  SECTORS,
} from '@/shared/constants/demo.constants';
import { useMediaQuery } from '@/shared/hooks/use-media-query.hook';
import type { DemoMode, DemoSetupPayload } from '@/shared/types/demo.types';
import { persistDemoSetup } from '@/shared/utils/demo-setup-storage.util';

function modeFromParam(p: string | undefined): DemoMode {
  return p === 'pos' ? 'pos' : 'temel';
}

export default function DemoOnboardingScreen() {
  const navigate = useNavigate();
  const { mode: modeParam } = useParams();
  const mode = modeFromParam(modeParam);

  const [step, setStep] = useState(0);
  const [sector, setSector] = useState('hamam');
  const [businessName, setBusinessName] = useState('Defter Demo Şubesi');
  const [sessionLabel, setSessionLabel] = useState('Kabine');
  const current = APP_ONBOARD_STEPS[step];
  const preset = getTemplatePreset(sector);
  const obNarrow = useMediaQuery('(max-width: 640px)');

  const onBack = () => {
    navigate('/');
  };

  const next = () => {
    if (step < APP_ONBOARD_STEPS.length - 1) {
      setStep((p) => p + 1);
      return;
    }
    const payload: DemoSetupPayload = {
      sector,
      businessName: businessName.trim() || 'Defter Demo Şubesi',
      sessionLabel: sessionLabel.trim() || preset.resourceLabel,
      template: preset,
    };
    persistDemoSetup(payload, mode);
    navigate(`/demo/app/${mode === 'pos' ? 'pos' : 'temel'}`, {
      state: { setup: payload },
      replace: true,
    });
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: C.bg,
        fontFamily: sans,
        padding:
          'max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left))',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 720,
          background: C.card,
          border: `2px solid ${C.dark}`,
          borderRadius: 14,
          padding: 'clamp(16px, 4vw, 28px)',
          maxHeight: 'min(100dvh - 24px, 900px)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 12,
            marginBottom: 18,
            flexWrap: obNarrow ? 'wrap' : 'nowrap',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 11,
                color: C.light,
                letterSpacing: 1.5,
                fontFamily: mono,
                marginBottom: 6,
              }}
            >
              ONBOARDING {step + 1}/{APP_ONBOARD_STEPS.length}
            </div>
            <div style={{ fontSize: 'clamp(18px, 4.5vw, 24px)', fontWeight: 700, color: C.dark, lineHeight: 1.2 }}>
              {current.title}
            </div>
            <div style={{ fontSize: 13, color: C.mid, marginTop: 6, lineHeight: 1.45 }}>{current.desc}</div>
          </div>
          <button
            type="button"
            onClick={onBack}
            style={{
              border: 'none',
              background: 'none',
              fontSize: 22,
              color: C.light,
              cursor: 'pointer',
              flexShrink: 0,
              lineHeight: 1,
              padding: 4,
            }}
            aria-label="Geri"
          >
            ←
          </button>
        </div>

        {current.id === 'sector' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 140px), 1fr))',
              gap: 10,
            }}
          >
            {SECTORS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSector(s.id);
                  const nextPreset = getTemplatePreset(s.id);
                  setSessionLabel(nextPreset.resourceLabel);
                }}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  border: `1px solid ${sector === s.id ? C.dark : C.border}`,
                  background: sector === s.id ? C.accentSoft : C.bg,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>{s.name}</div>
                <div style={{ fontSize: 11, color: C.light, marginTop: 2 }}>{s.session}</div>
              </button>
            ))}
          </div>
        )}

        {current.id === 'business' && (
          <div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: C.light, letterSpacing: 1, fontFamily: mono, marginBottom: 6 }}>
                İŞLETME ADI
              </div>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  borderRadius: 6,
                  border: bd,
                  fontSize: 14,
                  outline: 'none',
                  background: C.bg,
                  fontFamily: sans,
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.light, letterSpacing: 1, fontFamily: mono, marginBottom: 6 }}>
                OTURUM ETİKETİ
              </div>
              <input
                value={sessionLabel}
                onChange={(e) => setSessionLabel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  borderRadius: 6,
                  border: bd,
                  fontSize: 14,
                  outline: 'none',
                  background: C.bg,
                  fontFamily: sans,
                }}
              />
            </div>
          </div>
        )}

        {current.id === 'ready' && (
          <div style={{ border: bd, borderRadius: 10, padding: 16, background: C.bg }}>
            <div style={{ fontSize: 12, color: C.mid, marginBottom: 10 }}>Seçilen şablon ile otomatik yüklenecek:</div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: obNarrow ? '1fr' : 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: 8,
              }}
            >
              <div style={{ fontSize: 13, color: C.dark, wordBreak: 'break-word' }}>• {preset.categories.length} kategori</div>
              <div style={{ fontSize: 13, color: C.dark, wordBreak: 'break-word' }}>• {preset.services.length} hizmet</div>
              <div style={{ fontSize: 13, color: C.dark, wordBreak: 'break-word' }}>• Session etiketi: {sessionLabel}</div>
              <div style={{ fontSize: 13, color: C.dark, wordBreak: 'break-word' }}>• Kaynak tipi: {preset.resourceLabel}</div>
            </div>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: obNarrow ? 'column-reverse' : 'row',
            justifyContent: 'space-between',
            alignItems: obNarrow ? 'stretch' : 'center',
            marginTop: 20,
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={() => setStep((p) => Math.max(0, p - 1))}
            disabled={step === 0}
            style={{
              padding: '10px 16px',
              borderRadius: 6,
              border: bd,
              background: 'transparent',
              color: step === 0 ? C.light : C.dark,
              cursor: step === 0 ? 'not-allowed' : 'pointer',
              width: obNarrow ? '100%' : undefined,
            }}
          >
            Geri
          </button>
          <button
            type="button"
            onClick={next}
            className="cta"
            style={{
              padding: '12px 16px',
              borderRadius: 6,
              border: 'none',
              background: C.dark,
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer',
              width: obNarrow ? '100%' : undefined,
            }}
          >
            {step === APP_ONBOARD_STEPS.length - 1 ? 'Uygulamayı Başlat' : 'Devam Et'}
          </button>
        </div>
      </div>
    </div>
  );
}
