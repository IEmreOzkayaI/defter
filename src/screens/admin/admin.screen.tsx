import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { credentialsMatch, getAdminCredentials } from '@/shared/auth/admin-config';
import {
  clearAdminSession,
  isAdminSessionActive,
  setAdminSessionActive,
} from '@/shared/auth/admin-session.storage';
import { C, bd, mono, sans } from '@/shared/constants/demo.constants';
import {
  isAdminMockLeadsEnabled,
  isMockLeadId,
  mergeLeadsForDisplay,
} from '@/shared/data/admin-mock-leads.data';
import {
  getContactLeads,
  updateLeadNote,
  updateLeadStatus,
  type ContactLead,
  type LeadStatus,
} from '@/shared/storage/contact-leads.storage';

const STATUS_OPTIONS: { key: LeadStatus; label: string }[] = [
  { key: 'bought', label: 'Aldı' },
  { key: 'not_bought', label: 'Almadı' },
];

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('tr-TR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

export default function AdminScreen() {
  const [authed, setAuthed] = useState(() => isAdminSessionActive());
  const { isConfigured, mock: adminLoginMock } = useMemo(() => getAdminCredentials(), []);
  const mockDataEnabled = useMemo(() => isAdminMockLeadsEnabled(), []);

  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [loginErr, setLoginErr] = useState('');

  const [leads, setLeads] = useState<ContactLead[]>(() => mergeLeadsForDisplay(getContactLeads()));
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  const reload = useCallback(() => {
    const list = mergeLeadsForDisplay(getContactLeads());
    setLeads(list);
    setNoteDrafts(Object.fromEntries(list.map((l) => [l.id, l.note])));
  }, []);

  useEffect(() => {
    if (!authed) return;
    reload();
  }, [authed, reload]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErr('');
    if (!isConfigured) {
      setLoginErr(
        'Yönetici bilgileri tanımlı değil: kök .env içinde VITE_ADMIN_USERNAME ve VITE_ADMIN_PASSWORD ayarlayın; geliştirme sunucusunu veya Docker build’i yeniden çalıştırın.',
      );
      return;
    }
    if (credentialsMatch(user, pass)) {
      setAdminSessionActive();
      setAuthed(true);
      setPass('');
      reload();
    } else {
      setLoginErr('Kullanıcı adı veya şifre hatalı.');
    }
  };

  const logout = () => {
    clearAdminSession();
    setAuthed(false);
    setUser('');
    setPass('');
  };

  const saveNote = (id: string) => {
    if (isMockLeadId(id)) return;
    const text = noteDrafts[id] ?? '';
    updateLeadNote(id, text);
    reload();
  };

  const saveStatus = (id: string, status: LeadStatus) => {
    if (isMockLeadId(id)) return;
    updateLeadStatus(id, status);
    reload();
  };

  if (!authed) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          background: C.bg,
          fontFamily: sans,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div
            style={{
              background: C.card,
              border: bd,
              borderRadius: 14,
              padding: '36px 32px',
              boxShadow: '0 24px 80px rgba(0,0,0,.06)',
            }}
          >
            <div style={{ fontSize: 10, letterSpacing: 2, fontFamily: mono, color: C.light, marginBottom: 8 }}>DEFTER</div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.dark, marginBottom: 6, letterSpacing: -0.5 }}>Yönetim paneli</h1>
            <p style={{ fontSize: 13, color: C.mid, lineHeight: 1.5, marginBottom: 24 }}>Devam etmek için giriş yapın.</p>

            {adminLoginMock ? (
              <div
                style={{
                  fontSize: 12,
                  color: C.dark2,
                  background: '#fff4e0',
                  border: '1px solid #e8c48a',
                  padding: '12px 14px',
                  borderRadius: 8,
                  marginBottom: 20,
                  lineHeight: 1.45,
                }}
              >
                <strong>Mock giriş</strong> açık (<span style={{ fontFamily: mono, fontSize: 11 }}>VITE_ADMIN_LOGIN_MOCK</span>). Herhangi bir dolu kullanıcı adı ve
                şifre ile devam edebilirsiniz. Üretimde kapatın.
              </div>
            ) : null}
            {!isConfigured ? (
              <div
                style={{
                  fontSize: 12,
                  color: C.mid,
                  background: C.accentSoft,
                  padding: '12px 14px',
                  borderRadius: 8,
                  marginBottom: 20,
                  lineHeight: 1.45,
                }}
              >
                Kimlik bilgisi yok. Kök <span style={{ fontFamily: mono, fontSize: 11 }}>.env</span> dosyasına{' '}
                <span style={{ fontFamily: mono, fontSize: 11 }}>VITE_ADMIN_USERNAME</span> ve{' '}
                <span style={{ fontFamily: mono, fontSize: 11 }}>VITE_ADMIN_PASSWORD</span> ekleyin; ardından{' '}
                <span style={{ fontFamily: mono, fontSize: 11 }}>npm run dev</span> veya Docker{' '}
                <span style={{ fontFamily: mono, fontSize: 11 }}>docker compose build</span> ile yeniden derleyin. Geçici deneme için{' '}
                <span style={{ fontFamily: mono, fontSize: 11 }}>VITE_ADMIN_LOGIN_MOCK=true</span> de kullanılabilir.
              </div>
            ) : null}

            <form onSubmit={handleLogin}>
              <label style={{ display: 'block', marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontFamily: mono, letterSpacing: 0.8, color: C.light }}>KULLANICI ADI</span>
                <input
                  name="username"
                  autoComplete="username"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  style={{
                    marginTop: 6,
                    width: '100%',
                    padding: '12px 13px',
                    fontSize: 14,
                    border: bd,
                    borderRadius: 8,
                    outline: 'none',
                    fontFamily: sans,
                    background: C.bg,
                  }}
                />
              </label>
              <label style={{ display: 'block', marginTop: 16, marginBottom: 20 }}>
                <span style={{ fontSize: 10, fontFamily: mono, letterSpacing: 0.8, color: C.light }}>ŞİFRE</span>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  style={{
                    marginTop: 6,
                    width: '100%',
                    padding: '12px 13px',
                    fontSize: 14,
                    border: bd,
                    borderRadius: 8,
                    outline: 'none',
                    fontFamily: sans,
                    background: C.bg,
                  }}
                />
              </label>
              {loginErr ? (
                <p style={{ fontSize: 13, color: C.red, marginBottom: 14, marginTop: -8 }}>{loginErr}</p>
              ) : null}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: 14,
                  fontSize: 14,
                  fontWeight: 700,
                  borderRadius: 8,
                  border: 'none',
                  background: C.dark,
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: sans,
                }}
              >
                Giriş yap
              </button>
            </form>
            <div style={{ marginTop: 22, textAlign: 'center' }}>
              <Link to="/" style={{ fontSize: 12, color: C.light, textDecoration: 'none' }}>
                ← Ana sayfa
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: C.bg, fontFamily: sans, color: C.dark }}>
      {adminLoginMock ? (
        <div
          style={{
            padding: '10px clamp(16px, 4vw, 40px)',
            fontSize: 12,
            background: '#fff4e0',
            borderBottom: '1px solid #e8c48a',
            color: C.dark2,
          }}
        >
          Mock giriş etkin — üretimde <span style={{ fontFamily: mono, fontSize: 11 }}>VITE_ADMIN_LOGIN_MOCK</span> kapatın.
        </div>
      ) : null}
      {mockDataEnabled ? (
        <div
          style={{
            padding: '10px clamp(16px, 4vw, 40px)',
            fontSize: 12,
            background: '#eef6ff',
            borderBottom: `1px solid ${C.border}`,
            color: C.dark2,
          }}
        >
          Örnek talep satırları gösteriliyor (<span style={{ fontFamily: mono, fontSize: 11 }}>VITE_ADMIN_MOCK_DATA</span>). Üretimde kapatın; örnek satırlara not
          yazılamaz.
        </div>
      ) : null}

      <header
        style={{
          borderBottom: bd,
          background: C.card,
          padding: '16px clamp(16px, 4vw, 40px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ fontSize: 11, letterSpacing: 2, fontFamily: mono, color: C.light, marginBottom: 4 }}>DEFTER</div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>Talepler</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={reload}
            style={{
              padding: '8px 14px',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 6,
              border: bd,
              background: C.bg,
              color: C.dark,
              cursor: 'pointer',
              fontFamily: sans,
            }}
          >
            Yenile
          </button>
          <Link
            to="/"
            style={{
              padding: '8px 14px',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 6,
              border: bd,
              background: 'transparent',
              color: C.mid,
              textDecoration: 'none',
            }}
          >
            Ana sayfa
          </Link>
          <button
            type="button"
            onClick={logout}
            style={{
              padding: '8px 14px',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 6,
              border: 'none',
              background: C.dark,
              color: '#fff',
              cursor: 'pointer',
              fontFamily: sans,
            }}
          >
            Çıkış
          </button>
        </div>
      </header>

      <main style={{ padding: 'clamp(20px, 4vw, 40px)', maxWidth: 1100, margin: '0 auto' }}>
        {leads.length === 0 ? (
          <p style={{ fontSize: 15, color: C.mid, lineHeight: 1.6 }}>
            Henüz kayıtlı talep yok. Landing sayfasındaki “Başla / Hemen Başla” formundan gelen istekler burada listelenir (tarayıcıda yerel olarak saklanır). Tabloyu
            doldurmak için geçici olarak <span style={{ fontFamily: mono, fontSize: 13 }}>VITE_ADMIN_MOCK_DATA=true</span> kullanabilirsiniz.
          </p>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: 12, border: bd, background: C.card }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 880, fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: bd, textAlign: 'left', background: C.accentSoft }}>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: C.light, fontSize: 10, fontFamily: mono, letterSpacing: 1.2 }}>
                    KİŞİ
                  </th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: C.light, fontSize: 10, fontFamily: mono, letterSpacing: 1.2 }}>
                    TELEFON
                  </th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: C.light, fontSize: 10, fontFamily: mono, letterSpacing: 1.2 }}>
                    TARİH
                  </th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: C.light, fontSize: 10, fontFamily: mono, letterSpacing: 1.2 }}>
                    STATÜ
                  </th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: C.light, fontSize: 10, fontFamily: mono, letterSpacing: 1.2 }}>
                    NOT
                  </th>
                  <th style={{ padding: '14px 16px', width: 100 }} aria-hidden />
                </tr>
              </thead>
              <tbody>
                {leads.map((row) => {
                  const isMockRow = isMockLeadId(row.id);
                  return (
                    <tr
                      key={row.id}
                      style={{
                        borderBottom: bd,
                        verticalAlign: 'top',
                        background: isMockRow ? '#faf8f4' : undefined,
                      }}
                    >
                      <td style={{ padding: '14px 16px', color: C.dark, fontWeight: 600 }}>
                        {isMockRow ? (
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: 9,
                              fontFamily: mono,
                              fontWeight: 700,
                              letterSpacing: 0.5,
                              color: C.mid,
                              marginRight: 8,
                              padding: '2px 6px',
                              borderRadius: 4,
                              border: bd,
                              background: C.card,
                            }}
                          >
                            ÖRNEK
                          </span>
                        ) : null}
                        {row.name}
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: mono, fontSize: 13, color: C.dark2 }}>{row.phone}</td>
                      <td style={{ padding: '14px 16px', color: C.mid, fontSize: 13, whiteSpace: 'nowrap' }}>{fmtDate(row.createdAt)}</td>
                      <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxWidth: 280 }}>
                          {STATUS_OPTIONS.map(({ key, label }) => {
                            const active = row.status === key;
                            const disabled = isMockRow;
                            return (
                              <button
                                key={key}
                                type="button"
                                disabled={disabled}
                                onClick={() => saveStatus(row.id, key)}
                                style={{
                                  padding: '6px 10px',
                                  fontSize: 11,
                                  fontWeight: 600,
                                  borderRadius: 6,
                                  border: active ? `1px solid ${C.dark}` : bd,
                                  background: active ? C.dark : '#fff',
                                  color: active ? '#fff' : C.mid,
                                  cursor: disabled ? 'not-allowed' : 'pointer',
                                  fontFamily: sans,
                                  whiteSpace: 'nowrap',
                                  opacity: disabled ? 0.65 : 1,
                                }}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', minWidth: 200 }}>
                        <textarea
                          value={noteDrafts[row.id] ?? row.note}
                          readOnly={isMockRow}
                          onChange={(e) => setNoteDrafts((d) => ({ ...d, [row.id]: e.target.value }))}
                          placeholder={isMockRow ? 'Örnek satır' : 'İç not…'}
                          rows={3}
                          style={{
                            width: '100%',
                            resize: isMockRow ? 'none' : 'vertical',
                            padding: '10px 12px',
                            fontSize: 13,
                            lineHeight: 1.45,
                            border: bd,
                            borderRadius: 8,
                            outline: 'none',
                            fontFamily: sans,
                            background: isMockRow ? C.accentSoft : C.bg,
                            color: C.dark,
                            opacity: isMockRow ? 0.95 : 1,
                          }}
                        />
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          type="button"
                          disabled={isMockRow}
                          onClick={() => saveNote(row.id)}
                          style={{
                            padding: '8px 12px',
                            fontSize: 12,
                            fontWeight: 600,
                            borderRadius: 6,
                            border: 'none',
                            background: isMockRow ? C.border : C.dark,
                            color: isMockRow ? C.light : '#fff',
                            cursor: isMockRow ? 'not-allowed' : 'pointer',
                            fontFamily: sans,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Kaydet
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
