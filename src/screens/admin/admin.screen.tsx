import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import {
  clearAdminSession,
  getAdminSessionAuthorization,
  isAdminSessionActive,
  setAdminSessionActive,
} from '@/shared/auth/admin-session.storage';
import {
  adminLogin,
  deleteWaitlist,
  findAllWaitlist,
  updateWaitlist,
  type WaitlistItem,
  type WaitlistStatus,
} from '@/shared/api/waitlist.api';
import { C, bd, mono, sans } from '@/shared/constants/demo.constants';

const STATUS_OPTIONS: { key: WaitlistStatus; label: string }[] = [
  { key: 'new', label: 'Yeni' },
  { key: 'bought', label: 'Aldı' },
  { key: 'not_bought', label: 'Almadı' },
];

const STATUS_TONE: Record<WaitlistStatus, { bg: string; fg: string; border: string }> = {
  new: { bg: C.accentSoft, fg: C.dark, border: C.border },
  bought: { bg: C.greenSoft, fg: C.green, border: '#cbe9d9' },
  not_bought: { bg: C.redSoft, fg: C.red, border: '#f6caca' },
};

const TABLE_DS = {
  surface: '#ffffff',
  surfaceSoft: '#fbfbf9',
  headerBg: 'linear-gradient(180deg, #f3f3ef 0%, #ecece8 100%)',
  border: '#e4e4de',
  textMute: '#8f8f89',
  shadow: '0 14px 42px rgba(17,17,16,.07)',
} as const;

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

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function AdminScreen() {
  const [authed, setAuthed] = useState(() => isAdminSessionActive());
  const [authorization, setAuthorization] = useState<string | null>(() => getAdminSessionAuthorization());

  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [tableErr, setTableErr] = useState('');

  const [leads, setLeads] = useState<WaitlistItem[]>([]);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [noteModalId, setNoteModalId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<WaitlistStatus | 'all'>('all');

  const reload = useCallback(() => {
    if (!authorization) return;
    setLoading(true);
    setTableErr('');
    void findAllWaitlist({ authorization })
      .then((list) => {
        const safeList = Array.isArray(list) ? list : [];
        setLeads(safeList);
        setNoteDrafts(Object.fromEntries(safeList.map((l) => [l._id, l.note ?? ''])));
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Kayıtlar alınamadı.';
        setTableErr(message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [authorization]);

  useEffect(() => {
    if (!authed) return;
    reload();
  }, [authed, reload]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setLoginErr('');
    setLoading(true);
    void adminLogin({ username: user.trim(), password: pass })
      .then(({ authorization: authHeader }) => {
        setAdminSessionActive(authHeader);
        setAuthorization(authHeader);
        setAuthed(true);
        setPass('');
      })
      .catch(() => {
        setLoginErr('Kullanıcı adı veya şifre hatalı.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const logout = () => {
    clearAdminSession();
    setAuthorization(null);
    setAuthed(false);
    setUser('');
    setPass('');
    setLeads([]);
  };

  const saveNote = async (id: string): Promise<boolean> => {
    if (!authorization) return false;
    const text = noteDrafts[id] ?? '';
    setLoading(true);
    try {
      await updateWaitlist({ authorization, id, update: { note: text } });
      reload();
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Not kaydedilemedi.';
      setTableErr(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const saveStatus = (id: string, status: WaitlistStatus) => {
    if (!authorization) return;
    setLoading(true);
    void updateWaitlist({ authorization, id, update: { status } })
      .then(() => reload())
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Durum güncellenemedi.';
        setTableErr(message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteRow = (id: string) => {
    if (!authorization) return;
    setLoading(true);
    void deleteWaitlist({ authorization, id })
      .then(() => reload())
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Kayıt silinemedi.';
        setTableErr(message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const rows = useMemo(() => leads, [leads]);
  const activeNoteRow = useMemo(() => rows.find((row) => row._id === noteModalId) ?? null, [noteModalId, rows]);
  const stats = useMemo(() => {
    const total = rows.length;
    const newCount = rows.filter((row) => row.status === 'new').length;
    const boughtCount = rows.filter((row) => row.status === 'bought').length;
    return { total, newCount, boughtCount };
  }, [rows]);
  const filteredRows = useMemo(() => {
    const q = searchText.trim().toLocaleLowerCase('tr-TR');
    return rows.filter((row) => {
      const statusOk = statusFilter === 'all' ? true : row.status === statusFilter;
      if (!statusOk) return false;
      if (!q) return true;
      return (
        row.full_name.toLocaleLowerCase('tr-TR').includes(q) ||
        row.phone_number.toLocaleLowerCase('tr-TR').includes(q) ||
        (row.note ?? '').toLocaleLowerCase('tr-TR').includes(q)
      );
    });
  }, [rows, searchText, statusFilter]);
  const activeNoteValue = activeNoteRow ? noteDrafts[activeNoteRow._id] ?? activeNoteRow.note ?? '' : '';
  const activeNoteDirty = activeNoteRow ? activeNoteValue !== (activeNoteRow.note ?? '') : false;

  if (!authed || !authorization) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          background: `radial-gradient(1200px 400px at 10% -20%, ${C.accentSoft}, transparent), ${C.bg}`,
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
              boxShadow: '0 20px 60px rgba(17,17,16,.08)',
            }}
          >
            <div style={{ fontSize: 10, letterSpacing: 2, fontFamily: mono, color: C.light, marginBottom: 8 }}>DEFTER</div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.dark, marginBottom: 6, letterSpacing: -0.5 }}>Yönetim paneli</h1>
            <p style={{ fontSize: 13, color: C.mid, lineHeight: 1.5, marginBottom: 24 }}>Devam etmek için giriş yapın.</p>

            <form onSubmit={handleLogin}>
              <label style={{ display: 'block', marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontFamily: mono, letterSpacing: 0.8, color: C.light }}>KULLANICI ADI</span>
                <input
                  name="username"
                  autoComplete="username"
                  required
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
                  required
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
                disabled={loading}
                style={{
                  width: '100%',
                  padding: 14,
                  fontSize: 14,
                  fontWeight: 700,
                  borderRadius: 8,
                  border: 'none',
                  background: C.dark,
                  color: '#fff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: sans,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Giriş yapılıyor…' : 'Giriş yap'}
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
    <div style={{ minHeight: '100dvh', background: `radial-gradient(1000px 320px at 0% -10%, ${C.accentSoft}, transparent), ${C.bg}`, fontFamily: sans, color: C.dark }}>
      <header
        style={{
          borderBottom: bd,
          background: 'rgba(255,255,255,.75)',
          backdropFilter: 'blur(10px)',
          padding: '14px clamp(16px, 4vw, 40px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ fontSize: 11, letterSpacing: 2, fontFamily: mono, color: C.light}}>DEFTER ADMIN</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={reload}
            disabled={loading}
            style={{
              padding: '8px 14px',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 999,
              border: bd,
              background: C.bg,
              color: C.dark,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: sans,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Yükleniyor…' : 'Yenile'}
          </button>
          <Link
            to="/"
            style={{
              padding: '8px 14px',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 999,
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
              borderRadius: 999,
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
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: 10,
            marginBottom: 14,
          }}
        >
          {[
            { label: 'TOPLAM KAYIT', value: String(stats.total) },
            { label: 'YENİ', value: String(stats.newCount) },
            { label: 'ALDI', value: String(stats.boughtCount) },
          ].map((item) => (
            <article
              key={item.label}
              style={{
                border: bd,
                borderRadius: 12,
                background: C.card,
                padding: '12px 14px',
              }}
            >
              <div style={{ fontSize: 10, letterSpacing: 1.1, fontFamily: mono, color: C.light, marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: C.dark, letterSpacing: -0.8, fontFamily: mono }}>{item.value}</div>
            </article>
          ))}
        </section>

        {tableErr ? (
          <p
            style={{
              fontSize: 14,
              color: C.red,
              lineHeight: 1.6,
              marginBottom: 16,
              border: `1px solid ${STATUS_TONE.not_bought.border}`,
              borderRadius: 10,
              background: STATUS_TONE.not_bought.bg,
              padding: '10px 12px',
            }}
          >
            {tableErr}
          </p>
        ) : null}
        <section
          style={{
            border: bd,
            borderRadius: 12,
            background: C.card,
            padding: '10px 12px',
            marginBottom: 12,
            display: 'grid',
            gridTemplateColumns: 'minmax(220px, 1fr) auto',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Kişi, telefon veya not içinde ara..."
            style={{
              width: '100%',
              border: bd,
              borderRadius: 10,
              background: C.bg,
              padding: '10px 12px',
              fontSize: 13,
              color: C.dark,
              outline: 'none',
              fontFamily: sans,
            }}
          />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {[{ key: 'all', label: 'Tümü' }, ...STATUS_OPTIONS].map(({ key, label }) => {
              const active = statusFilter === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStatusFilter(key as WaitlistStatus | 'all')}
                  style={{
                    padding: '7px 10px',
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 999,
                    border: active ? `1px solid ${C.dark}` : bd,
                    background: active ? C.dark : '#fff',
                    color: active ? '#fff' : C.mid,
                    cursor: 'pointer',
                    fontFamily: sans,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        <div style={{ overflowX: 'auto', borderRadius: 14, border: `1px solid ${TABLE_DS.border}`, background: TABLE_DS.surface, boxShadow: TABLE_DS.shadow }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: 920, fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: 'left', background: TABLE_DS.headerBg }}>
                <th style={{ position: 'sticky', top: 0, zIndex: 2, padding: '13px 16px', fontWeight: 600, color: TABLE_DS.textMute, fontSize: 10, fontFamily: mono, letterSpacing: 1.2, borderBottom: `1px solid ${TABLE_DS.border}` }}>
                  KİŞİ
                </th>
                <th style={{ position: 'sticky', top: 0, zIndex: 2, padding: '13px 16px', fontWeight: 600, color: TABLE_DS.textMute, fontSize: 10, fontFamily: mono, letterSpacing: 1.2, borderBottom: `1px solid ${TABLE_DS.border}` }}>
                  TELEFON
                </th>
                <th style={{ position: 'sticky', top: 0, zIndex: 2, padding: '13px 16px', fontWeight: 600, color: TABLE_DS.textMute, fontSize: 10, fontFamily: mono, letterSpacing: 1.2, borderBottom: `1px solid ${TABLE_DS.border}` }}>
                  TARİH
                </th>
                <th style={{ position: 'sticky', top: 0, zIndex: 2, padding: '13px 16px', fontWeight: 600, color: TABLE_DS.textMute, fontSize: 10, fontFamily: mono, letterSpacing: 1.2, borderBottom: `1px solid ${TABLE_DS.border}` }}>
                  STATÜ
                </th>
                <th style={{ position: 'sticky', top: 0, zIndex: 2, padding: '13px 16px', fontWeight: 600, color: TABLE_DS.textMute, fontSize: 10, fontFamily: mono, letterSpacing: 1.2, borderBottom: `1px solid ${TABLE_DS.border}` }}>
                  NOT
                </th>
                <th style={{ position: 'sticky', top: 0, zIndex: 2, padding: '13px 16px', width: 100, borderBottom: `1px solid ${TABLE_DS.border}` }} aria-hidden />
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '20px 16px', textAlign: 'center', color: C.mid, background: TABLE_DS.surfaceSoft }}>
                    Data bulunmadı.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => {
                  const rowTone = row.status === 'bought' ? '#f7fffb' : row.status === 'not_bought' ? '#fff9f9' : '#ffffff';
                  const leftAccent = row.status === 'bought' ? '#b7e6cb' : row.status === 'not_bought' ? '#f0c3c3' : '#e6e6e1';
                  return (
                    <tr
                      key={row._id}
                      style={{
                        borderBottom: `1px solid ${TABLE_DS.border}`,
                        verticalAlign: 'top',
                        background: rowTone,
                      }}
                    >
                      <td style={{ padding: '14px 16px', borderLeft: `3px solid ${leftAccent}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 999, background: '#f0f0ec', border: `1px solid ${TABLE_DS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: mono, fontWeight: 700, color: C.dark }}>
                            {initials(row.full_name)}
                          </div>
                          <div>
                            <div style={{ color: C.dark, fontWeight: 700, lineHeight: 1.25 }}>{row.full_name}</div>
                            <div style={{ fontSize: 10, color: TABLE_DS.textMute, fontFamily: mono }}>{row._id.slice(-6).toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: mono, fontSize: 13, color: C.dark2 }}>{row.phone_number}</td>
                      <td style={{ padding: '14px 16px', color: C.mid, fontSize: 13, whiteSpace: 'nowrap' }}>{fmtDate(row.created_at)}</td>
                      <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxWidth: 280, background: '#f7f7f4', border: `1px solid ${TABLE_DS.border}`, borderRadius: 999, padding: 4 }}>
                          {STATUS_OPTIONS.map(({ key, label }) => {
                            const active = row.status === key;
                            return (
                              <button
                                key={key}
                                type="button"
                                disabled={loading}
                                onClick={() => saveStatus(row._id, key)}
                                style={{
                                  padding: '5px 10px',
                                  fontSize: 11,
                                  fontWeight: 600,
                                  borderRadius: 999,
                                  border: active ? `1px solid ${STATUS_TONE[key].border}` : '1px solid transparent',
                                  background: active ? STATUS_TONE[key].bg : '#fff',
                                  color: active ? STATUS_TONE[key].fg : C.mid,
                                  cursor: loading ? 'not-allowed' : 'pointer',
                                  fontFamily: sans,
                                  whiteSpace: 'nowrap',
                                  opacity: loading ? 0.65 : 1,
                                }}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', minWidth: 170 }}>
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => {
                            setNoteDrafts((d) => ({ ...d, [row._id]: d[row._id] ?? row.note ?? '' }));
                            setNoteModalId(row._id);
                          }}
                          style={{
                            padding: '8px 12px',
                            fontSize: 12,
                            fontWeight: 600,
                            borderRadius: 999,
                            border: `1px solid ${TABLE_DS.border}`,
                            background: '#fff',
                            color: C.dark2,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontFamily: sans,
                            whiteSpace: 'nowrap',
                            opacity: loading ? 0.7 : 1,
                          }}
                        >
                          {row.note?.trim() ? 'Notu Gör / Düzenle' : 'Not Ekle'}
                        </button>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => deleteRow(row._id)}
                            style={{
                              padding: '8px 12px',
                              fontSize: 12,
                              fontWeight: 600,
                              borderRadius: 999,
                              border: `1px solid ${STATUS_TONE.not_bought.border}`,
                              background: STATUS_TONE.not_bought.bg,
                              color: C.red,
                              cursor: loading ? 'not-allowed' : 'pointer',
                              fontFamily: sans,
                              whiteSpace: 'nowrap',
                              opacity: loading ? 0.7 : 1,
                            }}
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {activeNoteRow ? (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(17,17,16,.45)', backdropFilter: 'blur(4px)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div style={{ width: '100%', maxWidth: 620, border: `1px solid ${TABLE_DS.border}`, borderRadius: 16, background: C.card, boxShadow: '0 32px 100px rgba(17,17,16,.24)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', borderBottom: `1px solid ${TABLE_DS.border}`, background: TABLE_DS.headerBg, display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 10, color: TABLE_DS.textMute, fontFamily: mono, letterSpacing: 1 }}>İÇ NOT</div>
                  <div style={{ marginTop: 4, fontSize: 17, fontWeight: 700, color: C.dark }}>{activeNoteRow.full_name}</div>
                  <div style={{ marginTop: 4, display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, fontFamily: mono, color: C.light }}>#{activeNoteRow._id.slice(-6).toUpperCase()}</span>
                    <span style={{ fontSize: 10, color: C.light }}>•</span>
                    <span style={{ fontSize: 10, color: C.light }}>{fmtDate(activeNoteRow.created_at)}</span>
                  </div>
                </div>
                <button type="button" onClick={() => setNoteModalId(null)} style={{ border: 'none', background: '#fff', color: C.light, fontSize: 20, lineHeight: 1, cursor: 'pointer', borderRadius: 999, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ×
                </button>
              </div>

              <div style={{ padding: 16 }}>
                <div style={{ border: `1px solid ${activeNoteDirty ? C.dark : TABLE_DS.border}`, borderRadius: 12, background: TABLE_DS.surfaceSoft, padding: 10, transition: 'all .2s' }}>
                  <textarea
                    value={activeNoteValue}
                    readOnly={loading}
                    onChange={(e) => setNoteDrafts((d) => ({ ...d, [activeNoteRow._id]: e.target.value }))}
                    placeholder="Görüşme özeti, not, sonuç..."
                    rows={7}
                    maxLength={280}
                    style={{
                      width: '100%',
                      resize: loading ? 'none' : 'vertical',
                      minHeight: 180,
                      padding: '10px 12px',
                      fontSize: 14,
                      lineHeight: 1.55,
                      outline: 'none',
                      fontFamily: sans,
                      background: 'transparent',
                      color: C.dark,
                    }}
                  />
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 10, fontFamily: mono, color: activeNoteDirty ? C.dark : C.light }}>
                      {activeNoteDirty ? 'Kaydedilmedi' : 'Kaydedildi'}
                    </span>
                    <span style={{ fontSize: 10, color: C.light, fontFamily: mono }}>{activeNoteValue.length}/280</span>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${TABLE_DS.border}`, background: '#fff', padding: '12px 16px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" onClick={() => setNoteModalId(null)} style={{ padding: '9px 14px', borderRadius: 999, border: bd, background: '#fff', color: C.mid, fontWeight: 600, cursor: 'pointer' }}>
                  Vazgeç
                </button>
                <button
                  type="button"
                  disabled={loading || !activeNoteDirty}
                  onClick={async () => {
                    const ok = await saveNote(activeNoteRow._id);
                    if (ok) setNoteModalId(null);
                  }}
                  style={{ padding: '9px 16px', borderRadius: 999, border: 'none', background: C.dark, color: '#fff', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading || !activeNoteDirty ? 0.6 : 1 }}
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
