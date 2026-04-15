// @ts-nocheck — taşıma sonrası tip genişletmesi ayrı iterasyonda yapılabilir
import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react';

import {
  C,
  bd,
  mono,
  POS_DEVICES,
  sans,
  SECTORS,
  WEEKLY,
} from '@/shared/constants/demo.constants';
import { buildDailySessionReport } from '@/domain/session/session-report';
import { transitionStatus } from '@/domain/session/session.machine';
import { fmt } from '@/shared/utils/format.util';
import { mkSess, resetSessionIdCounterForTests } from '@/shared/utils/mk-session.util';
import { getSessionsNavLabel } from '@/shared/utils/session-label.util';
import { useThermaMobile } from '@/shared/hooks/use-therma-mobile.hook';
import type { DemoMode, DemoServiceRow, DemoSetupPayload, LandingUser } from '@/shared/types/demo.types';
import { resolveTemplateBySector } from '@/templates/template.resolver';

export function DemoServiceDrawer({ pickerCats, cat, setCat, filtered, onAddService, onClose }) {
  return (
    <>
      <div role="presentation" onClick={onClose} onKeyDown={undefined} style={{ position: "fixed", inset: 0, zIndex: 7000, background: "rgba(0,0,0,0.28)", animation: "fadeIn .15s ease" }} />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 7001,
          height: "min(80dvh, 560px)",
          maxWidth: 480,
          margin: "0 auto",
          background: C.card,
          borderRadius: "14px 14px 0 0",
          border: bd,
          borderBottom: "none",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 -8px 40px rgba(0,0,0,.12)",
          animation: "sheetUp .28s cubic-bezier(.32,.72,0,1)",
          paddingBottom: "max(12px, env(safe-area-inset-bottom))",
        }}
      >
        <div style={{ padding: "12px 16px 0", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border, marginBottom: 12 }} />
          <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>Hizmet Seç</span>
            <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, color: C.light, lineHeight: 1, padding: "0 4px", cursor: "pointer" }}>×</button>
          </div>
        </div>
        <div style={{ display: "flex", overflowX: "auto", borderBottom: bd, flexShrink: 0, WebkitOverflowScrolling: "touch" }}>
          {pickerCats.map((c) => (
            <button key={c.k} type="button" onClick={() => setCat(c.k)} style={{ padding: "9px 13px", fontSize: 11, fontWeight: 600, letterSpacing: 0.4, background: "transparent", border: "none", whiteSpace: "nowrap", borderBottom: cat === c.k ? `2px solid ${C.dark}` : "2px solid transparent", color: cat === c.k ? C.dark : C.light, cursor: "pointer" }}>
              {c.l.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto", minHeight: 0, WebkitOverflowScrolling: "touch" }}>
          {filtered.map((svc) => (
            <button key={svc.id} type="button" className="dr" onClick={() => onAddService(svc)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", border: "none", borderBottom: bd, background: C.card, textAlign: "left", cursor: "pointer" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>{svc.name}</div>
                {svc.dur > 0 && <div style={{ fontSize: 11, color: C.light, marginTop: 2 }}>{svc.dur} dk</div>}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: mono, color: C.dark }}>{fmt(svc.price)} ₺</div>
              <div style={{ width: 30, height: 30, borderRadius: 5, background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff", flexShrink: 0 }}>+</div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/** Mobil oturum detayı: sepet + sabit alt bar + drawer tetikleyici */
export function DemoMobileSessionDetail({
  active,
  filtered,
  cat,
  setCat,
  addItem,
  changeQty,
  posTarget,
  setShowPosModal,
  sending,
  sentOk,
  setConfirmId,
  canSendToPos,
  canCloseSession,
  canAddService,
  pickerCats,
  qtyBtn,
  sessionTotal,
  addServiceLabel,
  closeSessionLabel,
}) {
  const [showDrawer, setShowDrawer] = useState(false);
  const total = sessionTotal(active);

  return (
    <>
      {showDrawer && (
        <DemoServiceDrawer
          pickerCats={pickerCats}
          cat={cat}
          setCat={setCat}
          filtered={filtered}
          onAddService={(svc) => addItem(svc)}
          onClose={() => setShowDrawer(false)}
        />
      )}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden", background: C.card }}>
        <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
          {active.items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px", color: C.light, fontSize: 13, lineHeight: 1.5 }}>
              <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.35 }}>—</div>
              Henüz hizmet yok
              <div style={{ fontSize: 12, marginTop: 10 }}>Aşağıdan «{addServiceLabel}» ile başlayın.</div>
            </div>
          ) : (
            active.items.map((item) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: bd }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: C.light, fontFamily: mono, marginTop: 2 }}>
                    {fmt(item.price)} ₺{item.qty > 1 ? ` × ${item.qty} = ${fmt(item.price * item.qty)} ₺` : ""}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  <button type="button" onClick={() => changeQty(item.id, -1)} style={qtyBtn}>
                    −
                  </button>
                  <span style={{ fontSize: 13, fontWeight: 700, minWidth: 20, textAlign: "center", fontFamily: mono }}>{item.qty}</span>
                  <button type="button" onClick={() => changeQty(item.id, 1)} style={qtyBtn}>
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div style={{ borderTop: bd, padding: "12px 16px", paddingBottom: "max(12px, env(safe-area-inset-bottom))", background: C.card, flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, paddingBottom: 10, borderBottom: bd }}>
            <span style={{ fontSize: 11, color: C.light, letterSpacing: 0.8, fontFamily: mono }}>TOPLAM</span>
            <span style={{ fontSize: 22, fontWeight: 700, fontFamily: mono, color: C.dark }}>{fmt(total)} ₺</span>
          </div>
          {canAddService && (
            <button
              type="button"
              onClick={() => setShowDrawer(true)}
              style={{
                width: "100%",
                marginBottom: 10,
                padding: "11px 14px",
                borderRadius: 6,
                border: `1px dashed ${C.border}`,
                background: C.accentSoft,
                fontSize: 12,
                fontWeight: 700,
                color: C.dark,
                letterSpacing: 0.3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 16 }}>+</span> {addServiceLabel}
            </button>
          )}
          {canSendToPos ? (
            <>
              <button
                type="button"
                onClick={() => setShowPosModal(true)}
                style={{
                  width: "100%",
                  marginBottom: 10,
                  padding: "10px 14px",
                  borderRadius: 5,
                  border: `1px solid ${posTarget ? C.dark : C.border}`,
                  background: posTarget ? C.accentSoft : "transparent",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: posTarget ? C.green : C.light, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, flex: 1, color: C.dark, minWidth: 0 }}>{posTarget ? posTarget.name : "POS cihazı seç..."}</span>
                {posTarget && <span style={{ fontSize: 11, color: C.light, flexShrink: 0 }}>{posTarget.loc}</span>}
                <span style={{ fontSize: 11, color: C.light }}>▾</span>
              </button>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => {
                    if (!posTarget) {
                      setShowPosModal(true);
                      return;
                    }
                    if (active?.items.length > 0 && !sending) setShowPosModal(true);
                  }}
                  disabled={active?.items.length === 0 || sending}
                  style={{
                    flex: 1,
                    minWidth: 120,
                    padding: 12,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    border: "none",
                    borderRadius: 5,
                    background: sentOk ? C.green : active?.items.length === 0 ? C.accentSoft : C.dark,
                    color: active?.items.length === 0 ? C.light : "#fff",
                    cursor: active?.items.length === 0 || sending ? "not-allowed" : "pointer",
                  }}
                >
                  {sending ? "GÖNDERİLİYOR..." : sentOk ? "GÖNDERİLDİ ✓" : "POS'A GÖNDER"}
                </button>
                {canCloseSession && (
                  <button
                    type="button"
                    onClick={() => setConfirmId(active.id)}
                    disabled={sending}
                    style={{
                      padding: "12px 14px",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 0.4,
                      border: bd,
                      borderRadius: 5,
                      background: "transparent",
                      color: sending ? C.light : C.dark,
                      cursor: sending ? "not-allowed" : "pointer",
                    }}
                  >
                    {closeSessionLabel}
                  </button>
                )}
              </div>
            </>
          ) : canCloseSession ? (
            <button
              type="button"
              onClick={() => setConfirmId(active.id)}
              disabled={false}
              style={{
                width: "100%",
                padding: 12,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.5,
                border: "none",
                borderRadius: 5,
                background: C.dark,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {closeSessionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}

export function DemoApp({
  mode,
  onBack,
  setup,
  landingUser,
  onUserChange,
}: {
  mode: DemoMode;
  onBack: () => void;
  setup: DemoSetupPayload | null;
  landingUser: LandingUser | null;
  onUserChange?: (u: LandingUser) => void;
}) {
  const sectorId = setup?.sector || "hamam";
  const templateResolution = resolveTemplateBySector(sectorId);
  const template = setup?.template || templateResolution.preset;
  const templateMeta = templateResolution.template;
  const businessName = setup?.businessName || "Demo Şube";
  const sessionLabel = setup?.sessionLabel || template.resourceLabel || "Oturum";
  const sessionsNavLabel =
    templateMeta.labels.sessionsNav || getSessionsNavLabel(template.resourceLabel || sessionLabel, sectorId);
  const addServiceLabel = templateMeta.labels.addServiceCta;
  const closeSessionLabel = templateMeta.labels.closeSessionCta;
  const resourceTitle = (templateMeta.resourceName || template.resourceLabel || sessionLabel || "Kaynak").toUpperCase();
  const sessionSeed = {
    sector: sectorId,
    templateId: templateMeta.id,
    sessionLabel: template.sessionLabel,
    resourceLabel: template.resourceLabel,
    timerMode: templateMeta.timer.mode,
  };
  const readyResources = templateMeta.resourcePreset;
  const [view, setView] = useState("sessions");
  const [sessions, setSessions] = useState(() => []);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [cat, setCat] = useState("all");
  const [serviceCatalog, setServiceCatalog] = useState(() => template.services.map((s) => ({ kdv: 10, active: true, ...s })));
  const [serviceCategories, setServiceCategories] = useState(template.categories);
  const [profile, setProfile] = useState(() => ({
    email: landingUser?.email || "demo@defter.app",
    phone: landingUser?.phone || "",
    sector: setup?.sector || landingUser?.sector || sectorId,
    password: "",
    defaultSliceMinutes: 60,
  }));
  const [toast, setToast] = useState(null);
  const [addingName, setAddingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedPresetResource, setSelectedPresetResource] = useState(readyResources[0] || "");
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [expiryAlertId, setExpiryAlertId] = useState<number | null>(null);
  const [showPosModal, setShowPosModal] = useState(false);
  const [posTarget, setPosTarget] = useState(null);
  const [sending, setSending] = useState(false);
  const [sentOk, setSentOk] = useState(false);
  const isMobile = useThermaMobile();
  /** Mobil: oturum listesi vs sepet/detay (therma-pos ile uyumlu) */
  const [sessionUi, setSessionUi] = useState("list");

  useEffect(() => {
    resetSessionIdCounterForTests(100);
  }, []);

  useEffect(() => {
    if (view !== "sessions") setSessionUi("list");
  }, [view]);

  useEffect(() => {
    if (!landingUser?.email) return;
    setProfile((p) => ({ ...p, email: landingUser.email, phone: landingUser.phone || p.phone, sector: landingUser.sector || p.sector }));
  }, [landingUser]);

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 2200); };
  const open = sessions.filter((s) => s.status !== "closed");
  const closed = sessions.filter(s => s.status === "closed");
  const active = sessions.find(s => s.id === activeId);

  useEffect(() => {
    if (!active && sessionUi === "detail") setSessionUi("list");
  }, [active, sessionUi]);

  const stot = (s) => s.items.reduce((a, i) => a + i.price * i.qty, 0);
  const elapsed = (d) => { const m = Math.floor((Date.now()-d)/60000); return m<1?"az önce":`${m}dk`; };
  const timerModeLabel = (mode) =>
    mode === "count_up" ? "Sayac: Yukari" : mode === "count_down" ? "Sayac: Geri sayim" : "Sayac: Yok";
  const pickerCats = [{ k: "all", l: "Tümü" }, ...serviceCategories];
  const filtered = (cat === "all" ? serviceCatalog : serviceCatalog.filter((s) => s.cat === cat)).filter((s) => s.active !== false);
  const timedServices = serviceCatalog
    .filter((service) => service.active !== false && service.dur > 0)
    .sort((a, b) => a.dur - b.dur);
  const isMeteredSector = sectorId === "ps" || sectorId === "net";
  const packageServices = isMeteredSector
    ? serviceCatalog.filter((service) => service.active !== false && service.cat === "paket" && service.dur > 0)
    : [];
  const maxW = Math.max(...WEEKLY.map(d => d.v));
  const report = buildDailySessionReport(sessions);
  const closedRevenue = report.revenue;
  const openRevenue = open.reduce((a, s) => a + stot(s), 0);
  const allItemsClosed = closed.flatMap((s) => s.items);
  const salesAgg = {};
  for (const it of allItemsClosed) {
    salesAgg[it.name] = (salesAgg[it.name] || 0) + it.qty;
  }
  const topFromSessions = Object.entries(salesAgg).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const maxSale = Math.max(1, ...topFromSessions.map(([, q]) => q));
  const topSelling = topFromSessions.length > 0
    ? topFromSessions.map(([n, c]) => ({ n, c, p: Math.round((c / maxSale) * 100), session: true }))
    : serviceCatalog.filter((s) => s.active !== false).slice(0, 4).map((s, i) => ({ n: s.name, c: null, p: 82 - i * 14, session: false }));
  const hasPos = mode === "pos";
  const canAddService = templateMeta.actions.includes("add_service");
  const canCloseSession = templateMeta.actions.includes("close_session");
  const canSendToPos = hasPos && templateMeta.actions.includes("send_to_pos");
  const qtyBtn = { width: 26, height: 26, borderRadius: 4, border: bd, background: C.accentSoft, color: C.dark, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 };

  useEffect(() => {
    if (pickerCats.some((c) => c.k === cat)) return;
    setCat("all");
  }, [pickerCats, cat]);

  useEffect(() => {
    if (readyResources.length === 0) return;
    if (selectedPresetResource && readyResources.includes(selectedPresetResource)) return;
    setSelectedPresetResource(readyResources[0]);
  }, [readyResources, selectedPresetResource]);

  useEffect(() => {
    if (packageServices.length === 0) {
      setSelectedPackageId("");
      return;
    }
    if (selectedPackageId && packageServices.some((service) => String(service.id) === selectedPackageId)) return;
    setSelectedPackageId(String(packageServices[0].id));
  }, [packageServices, selectedPackageId]);

  const openPresetSession = () => {
    const resourceName = selectedPresetResource.trim();
    if (!resourceName) return;
    const alreadyOpen = open.find((session) => session.name === resourceName);
    if (alreadyOpen) {
      setActiveId(alreadyOpen.id);
      if (isMobile) setSessionUi("detail");
      showToast(`"${resourceName}" zaten acik`);
      return;
    }
    const defaultSliceMinutes = Math.max(1, Number(profile.defaultSliceMinutes) || 60);
    const selectedPackage = packageServices.find((service) => String(service.id) === selectedPackageId) ?? null;
    const timerPlan = selectedPackage
      ? {
          mode: "fixed_duration",
          sliceMinutes: null,
          fixedMinutes: selectedPackage.dur,
          warningShown: false,
        }
      : {
          mode: "count_up_slice",
          sliceMinutes: defaultSliceMinutes,
          fixedMinutes: null,
          warningShown: false,
        };
    const s = mkSess(resourceName, sessionSeed, { startImmediately: true, timerPlan });
    const sessionToOpen = selectedPackage
      ? {
          ...s,
          items: [{ ...selectedPackage, qty: 1 }],
        }
      : s;
    setSessions((p) => [...p, sessionToOpen]);
    setActiveId(sessionToOpen.id);
    if (isMobile) setSessionUi("detail");
    if (selectedPackage) {
      showToast("Masa sabit sureli olarak ayarlandi, sure doldugunda bildirileceksiniz.");
      return;
    }
    showToast(`"${resourceName}" acildi, sayac basladi`);
  };

  const addSession = () => {
    const n = newName.trim() || `${sessionLabel} ${sessions.length + 1}`;
    const s = mkSess(n, sessionSeed);
    setSessions((p) => [...p, s]);
    setNewName("");
    setAddingName(false);
    setActiveId(s.id);
    setView("sessions");
    if (isMobile) setSessionUi("detail");
    showToast(`"${n}" açıldı`);
  };
  const addItem = useCallback((svc) => { setSessions(p => p.map(s => { if(s.id!==activeId) return s; const ex=s.items.find(i=>i.id===svc.id); const nextStatus = s.status === "open" ? transitionStatus("open", "in_progress") : s.status; return {...s, status: nextStatus, items: ex ? s.items.map(i=>i.id===svc.id?{...i,qty:i.qty+1}:i) : [...s.items,{...svc,qty:1}]}; })); showToast(`+ ${svc.name}`); }, [activeId]);
  const changeQty = (itemId, delta) => { setSessions(p => p.map(s => { if(s.id!==activeId) return s; return {...s, items: s.items.map(i=>i.id===itemId?{...i,qty:i.qty+delta}:i).filter(i=>i.qty>0)}; })); };
  const closeSession = (sid) => {
    setSessions((p) =>
      p.map((s) => {
        if (s.id !== sid) return s;
        const prepared =
          s.status === "open" ? transitionStatus("open", "in_progress") : s.status;
        const pending =
          prepared === "pending_payment" ? prepared : transitionStatus(prepared, "pending_payment");
        const finalStatus = transitionStatus(pending, "closed");
        return {
          ...s,
          status: finalStatus,
          closedAt: new Date(),
          closingReason: s.items.length > 0 ? "payment" : "manual",
        };
      })
    );
    setConfirmId(null);
    showToast("Çek kapatıldı ✓");
    const rem = open.filter((s) => s.id !== sid);
    setActiveId(rem.length ? rem[0].id : null);
    if (isMobile) setSessionUi("list");
  };
  const sendToPos = async () => { if(!posTarget||!active||active.items.length===0) return; setShowPosModal(false); setSending(true); await new Promise(r=>setTimeout(r,1500)); setSending(false); setSentOk(true); showToast(`${posTarget.name} → gönderildi ✓`); setTimeout(()=>setSentOk(false),3000); };

  useEffect(() => {
    const timerId = window.setInterval(() => {
      let alertSessionId = null;

      setSessions((prev) =>
        prev.map((session) => {
          if (session.status !== "in_progress") return session;
          if (session.timerMode === "no_timer") return session;

          const elapsedMinutes = Math.floor((Date.now() - session.createdAt.getTime()) / 60000);
          if (elapsedMinutes < 1) return session;

          if (session.timerPlan.mode === "count_up_slice") {
            if (!isMeteredSector) return session;
            if (!canAddService || timedServices.length === 0) return session;
            const sliceMinutes = Math.max(1, session.timerPlan.sliceMinutes || 60);
            const passedSlices = Math.floor(elapsedMinutes / sliceMinutes);
            const appliedSlices = session.autoTimerServiceIds.length;
            if (passedSlices <= appliedSlices) return session;

            const toApply = passedSlices - appliedSlices;
            const matchedService =
              timedServices.find((service) => service.dur === sliceMinutes) ||
              timedServices.reduce((best, service) => {
                if (!best) return service;
                const bestGap = Math.abs(best.dur - sliceMinutes);
                const gap = Math.abs(service.dur - sliceMinutes);
                return gap < bestGap ? service : best;
              }, null);
            if (!matchedService) return session;

            const existing = session.items.find((item) => item.id === matchedService.id);
            return {
              ...session,
              autoTimerServiceIds: [
                ...session.autoTimerServiceIds,
                ...Array.from({ length: toApply }, () => matchedService.id),
              ],
              items: existing
                ? session.items.map((item) =>
                    item.id === matchedService.id ? { ...item, qty: item.qty + toApply } : item
                  )
                : [...session.items, { ...matchedService, qty: toApply }],
            };
          }

          if (session.timerPlan.warningShown) return session;

          if (session.timerPlan.mode === "fixed_duration") {
            const target = session.timerPlan.fixedMinutes || 0;
            if (target > 0 && elapsedMinutes >= target) {
              if (!alertSessionId) alertSessionId = session.id;
              return {
                ...session,
                timerPlan: { ...session.timerPlan, warningShown: true },
              };
            }
            return session;
          }

          return session;
        })
      );

      if (alertSessionId) {
        setExpiryAlertId((prev) => prev ?? alertSessionId);
      }
    }, 10000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [canAddService, timedServices, isMeteredSector]);

  const handleHeaderBack = () => {
    if (view === "profile") { setView("sessions"); return; }
    if (isMobile && view === "sessions" && sessionUi === "detail") { setSessionUi("list"); return; }
    onBack();
  };

  const showCatalog = Boolean(active && !isMobile && canAddService);
  const showCartPanel = Boolean(active && !isMobile);

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: C.bg, fontFamily: sans, paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes sheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        .dr:hover{background:${C.accentSoft}!important}
        html,body,#root{height:100%}
        html{-webkit-tap-highlight-color:transparent}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:${C.light};border-radius:2px}
      `}</style>

      {toast && <div style={{ position:"fixed",bottom:"max(20px, env(safe-area-inset-bottom))",left:"50%",transform:"translateX(-50%)",maxWidth:"min(92vw, 420px)",padding:"9px 16px",background:C.dark,color:"#fff",borderRadius:6,fontSize:12,fontFamily:mono,zIndex:9999,animation:"fadeUp .18s ease",boxShadow:"0 4px 20px rgba(0,0,0,.15)",textAlign:"center"}}>{toast}</div>}

      {confirmId && (()=>{ const s=sessions.find(x=>x.id===confirmId); if(!s) return null; return (
        <div style={{position:"fixed",inset:0,background:"rgba(250,250,248,.92)",zIndex:8000,display:"flex",alignItems:isMobile?"flex-end":"center",justifyContent:"center",padding:"max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left))",animation:"fadeIn .15s ease",overflowY:"auto"}}>
          <div style={{background:C.card,border:`2px solid ${C.dark}`,borderRadius:isMobile?"12px 12px 0 0":12,padding:"clamp(18px, 4vw, 28px)",width:"100%",maxWidth:400,maxHeight:"min(90dvh, 560px)",overflowY:"auto",WebkitOverflowScrolling:"touch",animation:"fadeUp .18s ease",margin:isMobile?0:"auto"}}>
            <div style={{fontSize:10,color:C.light,letterSpacing:1.5,fontFamily:mono,marginBottom:8}}>{closeSessionLabel.toUpperCase()}</div>
            <div style={{fontSize:22,fontWeight:700,color:C.dark,marginBottom:4}}>{s.name}</div>
            <div style={{fontSize:32,fontWeight:700,fontFamily:mono,color:C.dark,marginBottom:6}}>{fmt(stot(s))} ₺</div>
            <div style={{fontSize:12,color:C.mid,marginBottom:24}}>{s.items.length} kalem · {s.items.reduce((a,i)=>a+i.qty,0)} adet</div>
            <div style={{display:"flex",flexDirection:isMobile?"column-reverse":"row",gap:8}}>
              <button type="button" onClick={()=>setConfirmId(null)} style={{flex:1,padding:12,fontSize:13,fontWeight:600,borderRadius:6,border:bd,background:"transparent",color:C.dark,cursor:"pointer",width:isMobile?"100%":undefined}}>İptal</button>
              <button type="button" onClick={()=>closeSession(confirmId)} style={{flex:1,padding:12,fontSize:13,fontWeight:700,borderRadius:6,border:"none",background:C.dark,color:"#fff",cursor:"pointer",width:isMobile?"100%":undefined}}>{closeSessionLabel}</button>
            </div>
          </div>
        </div>); })()}

      {expiryAlertId && (()=>{ const s=sessions.find(x=>x.id===expiryAlertId); if(!s) return null; return (
        <div style={{position:"fixed",inset:0,background:"rgba(250,250,248,.92)",zIndex:8100,display:"flex",alignItems:isMobile?"flex-end":"center",justifyContent:"center",padding:"max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left))",animation:"fadeIn .15s ease",overflowY:"auto"}}>
          <div style={{background:C.card,border:`2px solid ${C.dark}`,borderRadius:isMobile?"12px 12px 0 0":12,padding:"clamp(18px, 4vw, 28px)",width:"100%",maxWidth:420,maxHeight:"min(90dvh, 560px)",overflowY:"auto",WebkitOverflowScrolling:"touch",animation:"fadeUp .18s ease",margin:isMobile?0:"auto"}}>
            <div style={{fontSize:10,color:C.light,letterSpacing:1.5,fontFamily:mono,marginBottom:8}}>SURE / HIZMET BITTI</div>
            <div style={{fontSize:22,fontWeight:700,color:C.dark,marginBottom:4}}>{s.name}</div>
            <div style={{fontSize:13,color:C.mid,marginBottom:16}}>Bu masa icin tanimli sure/hizmet tamamlaniyor. Kapatmak ister misin?</div>
            <div style={{display:"flex",flexDirection:isMobile?"column-reverse":"row",gap:8}}>
              <button type="button" onClick={()=>setExpiryAlertId(null)} style={{flex:1,padding:12,fontSize:13,fontWeight:600,borderRadius:6,border:bd,background:"transparent",color:C.dark,cursor:"pointer",width:isMobile?"100%":undefined}}>Devam Et</button>
              <button type="button" onClick={()=>{setExpiryAlertId(null); setConfirmId(s.id);}} style={{flex:1,padding:12,fontSize:13,fontWeight:700,borderRadius:6,border:"none",background:C.dark,color:"#fff",cursor:"pointer",width:isMobile?"100%":undefined}}>Masa Kapat</button>
            </div>
          </div>
        </div>); })()}

      {showPosModal && hasPos && <PosModal alignBottom={isMobile} devices={POS_DEVICES} selected={posTarget} onSelect={setPosTarget} onConfirm={sendToPos} sending={sending} sentOk={sentOk} onClose={()=>setShowPosModal(false)} activeItems={active?.items} />}

      {/* therma-pos: mobilde maxWidth 480 ortalı sütun + sticky header */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflow: "hidden",
          width: "100%",
          ...(isMobile
            ? { maxWidth: 480, margin: "0 auto", minHeight: "100dvh" }
            : {}),
        }}
      >
      {/* Header */}
      <header style={{ height: isMobile ? "auto" : 52, minHeight: 52, borderBottom: bd, display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center", justifyContent: "space-between", gap: 8, padding: isMobile ? "4px 16px 8px" : "0 20px", flexShrink: 0, background: C.card, ...(isMobile ? { position: "sticky", top: 0, zIndex: 100 } : {}) }}>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 6 : 10, flexWrap: "wrap", minWidth: 0, paddingTop: isMobile ? "max(4px, env(safe-area-inset-top))" : 0, paddingBottom: isMobile ? 2 : 0 }}>
          <button type="button" onClick={handleHeaderBack} style={{ background: "none", border: "none", fontSize: 18, color: C.dark, cursor: "pointer", flexShrink: 0 }} title={view === "profile" ? "Uygulamaya dön" : isMobile && view === "sessions" && sessionUi === "detail" ? "Oturumlara dön" : "Çıkış"}>←</button>
          {isMobile && view === "sessions" && sessionUi === "detail" && active ? (
            <span style={{ fontSize: 15, fontWeight: 700, color: C.dark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }} title={active.name}>
              {active.name}
              <span style={{ fontWeight: 400, color: C.light, fontFamily: mono, fontSize: 12 }}> /detay</span>
            </span>
          ) : (
            <>
              <span style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, letterSpacing: -0.5, color: C.dark }}>defter</span>
              <span style={{ fontSize: 9, fontFamily: mono, color: "#fff", background: C.dark, padding: "3px 8px", borderRadius: 4, letterSpacing: 0.5, fontWeight: 600, flexShrink: 0 }}>DEMO</span>
              <span style={{ fontSize: 10, color: C.light, fontFamily: mono, display: isMobile ? "none" : "inline" }}>{hasPos ? "Temel + POS" : "Temel"}</span>
              <span style={{ fontSize: 11, color: C.mid, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: isMobile ? "min(42vw, 140px)" : 280 }} title={businessName}>· {businessName}</span>
            </>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "nowrap", overflowX: "auto", WebkitOverflowScrolling: "touch", flexShrink: 0, width: isMobile ? "100%" : undefined, maxWidth: "100%", paddingBottom: isMobile ? 2 : 0, scrollbarWidth: "thin" }}>
          {view !== "profile" && [["sessions", sessionsNavLabel], ["analytics", "ANALİZ"], ["services", "HİZMETLER"]].map(([t, l]) => (
            <button key={t} type="button" onClick={() => setView(t)} style={{ padding: isMobile ? "5px 8px" : "6px 14px", fontSize: isMobile ? 9 : 11, fontWeight: 600, letterSpacing: isMobile ? 0.3 : 0.5, border: `1px solid ${view === t ? C.dark : "transparent"}`, background: view === t ? C.dark : "transparent", color: view === t ? "#fff" : C.light, borderRadius: 3, cursor: "pointer", transition: "all .15s", flexShrink: 0 }}>{l}</button>
          ))}
          {view === "profile" && <span style={{ fontSize: 11, fontWeight: 600, color: C.dark }}>Profil</span>}
        </div>
      </header>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>

      {view === "profile" && (
        <DemoProfileScreen
          profile={profile}
          onChange={setProfile}
          onBack={() => setView("sessions")}
          onSave={() => {
            onUserChange?.({ email: profile.email, phone: profile.phone, sector: profile.sector });
            showToast("Profil kaydedildi");
          }}
        />
      )}

      {/* ANALYTICS */}
      {view==="analytics" && (
        <div style={{ flex: 1, padding: isMobile ? 16 : 24, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 12, color: C.mid, marginBottom: -6 }}>{SECTORS.find((s) => s.id === sectorId)?.name || "Şablon"} · özet (demo veri + kapalı oturumlar)</div>
          <div style={{ fontSize: 11, color: C.light }}>
            Bekleyen odeme: {report.pendingPaymentSessions} · Sifir sure kapanis: {report.zeroDurationClosures} · Manuel kapanis: {report.manualClosures}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))",gap:10}}>
            {[
              { l: "Kapalı ciro", v: `${fmt(closedRevenue)} ₺`, d: `${closed.length} kapalı` },
              { l: "Açık tahmini", v: `${fmt(openRevenue)} ₺`, d: `${open.length} açık oturum` },
              { l: "Toplam işlem", v: String(report.totalSessions), d: "oturum kaydı" },
              { l: "Ort. süre (kapalı)", v: report.closedSessions ? `${report.averageSessionDurationMinutes} dk` : "—", d: "kapananlar" },
            ].map((k, i) => (
              <div key={i} style={{border:bd,borderRadius:8,padding:16,background:C.card}}>
                <div style={{fontSize:10,color:C.light,letterSpacing:1,fontFamily:mono,marginBottom:8}}>{k.l.toUpperCase()}</div>
                <div style={{fontSize:22,fontWeight:700,fontFamily:mono,color:C.dark,marginBottom:3}}>{k.v}</div>
                <div style={{fontSize:11,color:C.green}}>{k.d}</div>
              </div>))}
          </div>
          <div style={{border:bd,borderRadius:8,padding:16,background:C.card,minWidth:0}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:1,marginBottom:14,color:C.mid,fontFamily:mono}}>HAFTALIK İŞLEM (ÖRNEK)</div>
            <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch",marginLeft:-4,marginRight:-4,paddingLeft:4,paddingRight:4}}>
              <div style={{display:"flex",alignItems:"flex-end",gap:isMobile?4:6,height:120,minWidth:isMobile?320:"auto"}}>
                {WEEKLY.map((d,i)=>(<div key={i} style={{flex:isMobile?"0 0 36px":1,minWidth:isMobile?36:0,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}><div style={{width:"100%",background:C.dark,borderRadius:"3px 3px 0 0",height:`${(d.v/maxW)*100}px`,transition:"height .4s ease"}} /><span style={{fontSize:9,color:C.light,fontFamily:mono,whiteSpace:"nowrap"}}>{d.d}</span></div>))}
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
            <div style={{border:bd,borderRadius:8,padding:16,background:C.card}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:1,marginBottom:14,color:C.mid,fontFamily:mono}}>EN ÇOK SATILAN {topFromSessions.length ? "(KAPALI)" : "(ŞABLON)"}</div>
              {topSelling.map((s,i)=>(
                <div key={i} style={{marginBottom:11}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12,fontWeight:500,color:C.dark}}>{s.n}</span><span style={{fontSize:11,color:C.light,fontFamily:mono}}>{s.session ? `${s.c} adet` : "örnek"}</span></div>
                  <div style={{height:3,background:C.accentSoft,borderRadius:2}}><div style={{width:`${s.p}%`,height:"100%",background:C.dark,borderRadius:2}} /></div>
                </div>))}
            </div>
            {hasPos ? (
              <div style={{border:bd,borderRadius:8,padding:16,background:C.card}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:1,marginBottom:12,color:C.mid,fontFamily:mono}}>POS DURUM</div>
                {POS_DEVICES.map(p=>(<div key={p.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:p.st==="online"?C.green:p.st==="busy"?C.light:"#ddd"}} />
                  <div style={{flex:1}}><span style={{fontSize:12,fontWeight:600,color:C.dark}}>{p.name}</span><span style={{fontSize:11,color:C.light,marginLeft:6}}>{p.loc}</span></div>
                  <span style={{fontSize:10,color:C.light,fontFamily:mono}}>{p.st==="online"?"AKTİF":p.st==="busy"?"MEŞGUL":"KAPALI"}</span>
                </div>))}
              </div>
            ) : (
              <div style={{border:`1.5px dashed ${C.border}`,borderRadius:8,padding:20,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
                <div style={{fontSize:24,color:C.light,marginBottom:8}}>⬡</div>
                <div style={{fontSize:13,fontWeight:600,color:C.mid,marginBottom:4}}>POS Modülü</div>
                <div style={{fontSize:11,color:C.light}}>Temel + POS planında mevcut</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SERVICES */}
      {view==="services" && (
        <ServicesAdmin
          hasPos={hasPos}
          services={serviceCatalog}
          setServices={setServiceCatalog}
          categories={serviceCategories}
          setCategories={setServiceCategories}
        />
      )}

      {/* SESSIONS — masaüstü: 3 sütun · mobil (≤900px / kompakt görünüm): liste ↔ detay + hizmet sheet */}
      {view==="sessions" && (
        isMobile ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden", background: C.bg, maxWidth: 480, width: "100%", margin: "0 auto", alignSelf: "stretch" }}>
            {sessionUi === "list" && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
                <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", padding: "0 0 8px" }}>
                  <div style={{ padding: "14px 16px 8px" }}>
                    {readyResources.length > 0 && (
                      <div style={{ border: bd, borderRadius: 8, padding: 10, marginBottom: 10, background: C.card }}>
                        <div style={{ fontSize: 10, color: C.light, letterSpacing: 1, fontFamily: mono, marginBottom: 7 }}>
                          HAZIR {resourceTitle} SEC
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <select
                            value={selectedPresetResource}
                            onChange={(e) => setSelectedPresetResource(e.target.value)}
                            style={{ flex: 1, minWidth: 0, padding: "9px 10px", borderRadius: 6, border: bd, background: C.bg, fontFamily: sans, fontSize: 12 }}
                          >
                            {readyResources.map((resource) => (
                              <option key={resource} value={resource}>
                                {resource}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={openPresetSession}
                            style={{ padding: "9px 12px", borderRadius: 6, border: "none", background: C.dark, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                          >
                            Ac
                          </button>
                        </div>
                        {isMeteredSector && (
                          <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
                            <div style={{ fontSize: 11, color: C.mid }}>
                              Varsayilan dilim: {profile.defaultSliceMinutes} dk (Profil'den degistirilebilir)
                            </div>
                            {packageServices.length > 0 && (
                              <select
                                value={selectedPackageId}
                                onChange={(e) => setSelectedPackageId(e.target.value)}
                                style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: bd, background: C.bg, fontFamily: sans, fontSize: 12 }}
                              >
                                <option value="">Saatlik akis (otomatik dilim)</option>
                                {packageServices.map((service) => (
                                  <option key={service.id} value={String(service.id)}>
                                    Sabit paket: {service.name} ({service.dur} dk)
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    <div style={{ fontSize: 10, color: C.light, letterSpacing: 1, marginBottom: 10, fontFamily: mono }}>AÇIK — {open.length}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {open.length === 0 && !addingName && (
                        <div style={{ textAlign: "center", padding: "28px 0", color: C.light, fontSize: 13 }}>Açık oturum yok</div>
                      )}
                      {open.map((s, i) => (
                        <button
                          key={s.id}
                          type="button"
                          className="dr"
                          onClick={() => { setActiveId(s.id); setSessionUi("detail"); }}
                          style={{
                            animation: `fadeUp .16s ease ${i * 0.03}s both`,
                            width: "100%",
                            background: C.card,
                            border: bd,
                            borderRadius: 8,
                            padding: "13px 14px",
                            textAlign: "left",
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            cursor: "pointer",
                          }}
                        >
                          <div style={{ width: 40, height: 40, borderRadius: 6, background: C.accentSoft, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: mono, color: C.dark }}>
                            {s.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: C.light, fontFamily: mono, marginTop: 2 }}>
                              {elapsed(s.createdAt)} · {s.items.reduce((a, i) => a + i.qty, 0)} hizmet · {timerModeLabel(s.timerMode)}
                            </div>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: mono, color: C.dark }}>{fmt(stot(s))} ₺</div>
                            <div style={{ fontSize: 11, color: C.light, marginTop: 2 }}>→</div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div style={{ marginTop: 10 }}>
                      {!addingName ? (
                        <button type="button" onClick={() => setAddingName(true)} style={{ width: "100%", padding: 12, borderRadius: 8, border: `1px dashed ${C.border}`, background: "transparent", color: C.mid, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                          + Yeni {sessionLabel} Aç
                        </button>
                      ) : (
                        <div style={{ border: `1px solid ${C.dark}`, borderRadius: 8, padding: 14, animation: "fadeUp .15s ease" }}>
                          <div style={{ fontSize: 10, color: C.light, letterSpacing: 1, marginBottom: 8, fontFamily: mono }}>YENİ OTURUM</div>
                          <input
                            autoFocus
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") addSession(); if (e.key === "Escape") setAddingName(false); }}
                            placeholder={`${sessionLabel} adı...`}
                            style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: bd, borderRadius: 6, outline: "none", fontFamily: sans, marginBottom: 10, background: C.card }}
                          />
                          <div style={{ display: "flex", gap: 8 }}>
                            <button type="button" onClick={() => setAddingName(false)} style={{ flex: 1, padding: 10, fontSize: 12, fontWeight: 600, borderRadius: 6, border: bd, background: "transparent", color: C.dark, cursor: "pointer" }}>İptal</button>
                            <button type="button" onClick={addSession} style={{ flex: 1, padding: 10, fontSize: 12, fontWeight: 700, borderRadius: 6, border: "none", background: C.dark, color: "#fff", cursor: "pointer" }}>Aç</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {closed.length > 0 && (
                    <div style={{ borderTop: bd, marginTop: 8 }}>
                      <div style={{ padding: "9px 16px", background: C.accentSoft }}>
                        <span style={{ fontSize: 10, color: C.light, letterSpacing: 1, fontFamily: mono }}>KAPALI — {closed.length}</span>
                      </div>
                      {closed.map((s) => (
                        <div key={s.id} style={{ padding: "10px 16px", borderBottom: bd, background: C.accentSoft, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: C.mid }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: C.light }}>{s.items.reduce((a, i) => a + i.qty, 0)} hizmet</div>
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: mono, color: C.mid }}>{fmt(stot(s))} ₺</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ borderTop: bd, padding: "10px 12px", background: C.card, flexShrink: 0 }}>
                  <button type="button" onClick={() => setView("profile")} style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", border: "none", background: "transparent", padding: "4px", cursor: "pointer", textAlign: "left" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.dark, flexShrink: 0 }}>
                      {(profile.email || "?").charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.dark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile.email}</div>
                      <div style={{ fontSize: 10, color: C.light, fontFamily: mono }}>Profil ve ayarlar</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
            {sessionUi === "detail" && active && (
              <DemoMobileSessionDetail
                active={active}
                filtered={filtered}
                cat={cat}
                setCat={setCat}
                addItem={addItem}
                changeQty={changeQty}
                posTarget={posTarget}
                setShowPosModal={setShowPosModal}
                sending={sending}
                sentOk={sentOk}
                setConfirmId={setConfirmId}
                canSendToPos={canSendToPos}
                canCloseSession={canCloseSession}
                canAddService={canAddService}
                pickerCats={pickerCats}
                qtyBtn={qtyBtn}
                sessionTotal={stot}
                addServiceLabel={addServiceLabel}
                closeSessionLabel={closeSessionLabel}
              />
            )}
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "row", minHeight: 0, overflow: "hidden" }}>
              <div style={{ width: "clamp(220px, 24vw, 260px)", minHeight: 0, borderRight: bd, display: "flex", flexDirection: "column", flexShrink: 0, background: C.card }}>
                <div style={{ padding: "12px 16px", borderBottom: bd, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: C.light, letterSpacing: 1.5, fontFamily: mono }}>AÇIK — {open.length}</span>
                  <button type="button" onClick={() => setAddingName((v) => !v)} style={{ fontSize: 18, background: "none", border: "none", color: C.light, cursor: "pointer" }}>+</button>
                </div>
                {readyResources.length > 0 && (
                  <div style={{ padding: "10px 14px", borderBottom: bd, background: C.accentSoft }}>
                    <div style={{ fontSize: 10, color: C.light, letterSpacing: 1, marginBottom: 7, fontFamily: mono }}>
                      HAZIR {resourceTitle} SEC
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <select
                        value={selectedPresetResource}
                        onChange={(e) => setSelectedPresetResource(e.target.value)}
                        style={{ flex: 1, minWidth: 0, padding: "8px 10px", fontSize: 12, border: bd, borderRadius: 5, outline: "none", fontFamily: sans, background: C.card }}
                      >
                        {readyResources.map((resource) => (
                          <option key={resource} value={resource}>
                            {resource}
                          </option>
                        ))}
                      </select>
                      <button type="button" onClick={openPresetSession} style={{ padding: "8px 10px", fontSize: 12, fontWeight: 700, borderRadius: 5, border: "none", background: C.dark, color: "#fff", cursor: "pointer" }}>
                        Ac
                      </button>
                    </div>
                    {isMeteredSector && (
                      <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
                        <div style={{ fontSize: 11, color: C.mid }}>
                          Varsayilan dilim: {profile.defaultSliceMinutes} dk (Profil'den degistirilebilir)
                        </div>
                        {packageServices.length > 0 && (
                          <select
                            value={selectedPackageId}
                            onChange={(e) => setSelectedPackageId(e.target.value)}
                            style={{ width: "100%", padding: "8px 10px", fontSize: 12, border: bd, borderRadius: 5, outline: "none", fontFamily: sans, background: C.card }}
                          >
                            <option value="">Saatlik akis (otomatik dilim)</option>
                            {packageServices.map((service) => (
                              <option key={service.id} value={String(service.id)}>
                                Sabit paket: {service.name} ({service.dur} dk)
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {addingName && (
                  <div style={{ padding: "10px 14px", borderBottom: bd, background: C.accentSoft, animation: "fadeUp .15s ease" }}>
                    <input autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addSession(); if (e.key === "Escape") setAddingName(false); }} placeholder={`${sessionLabel} adı...`} style={{ width: "100%", padding: "8px 10px", fontSize: 13, border: bd, borderRadius: 5, outline: "none", fontFamily: sans, marginBottom: 8, background: C.card }} />
                    <div style={{ display: "flex", gap: 6 }}>
                      <button type="button" onClick={() => setAddingName(false)} style={{ flex: 1, padding: 8, fontSize: 12, fontWeight: 600, borderRadius: 5, border: bd, background: "transparent", color: C.dark, cursor: "pointer" }}>İptal</button>
                      <button type="button" onClick={addSession} style={{ flex: 1, padding: 8, fontSize: 12, fontWeight: 700, borderRadius: 5, border: "none", background: C.dark, color: "#fff", cursor: "pointer" }}>Aç</button>
                    </div>
                  </div>
                )}
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {open.length === 0 && !addingName && <div style={{ padding: "40px 0", textAlign: "center", color: C.light, fontSize: 12 }}>Açık oturum yok</div>}
                  {open.map((s) => (
                    <button key={s.id} type="button" className="dr" onClick={() => setActiveId(s.id)} style={{ width: "100%", padding: "12px 16px", border: "none", textAlign: "left", background: activeId === s.id ? C.accentSoft : "transparent", borderBottom: bd, borderLeft: activeId === s.id ? `3px solid ${C.dark}` : "3px solid transparent", cursor: "pointer", transition: "all .1s" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>{s.name}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, fontFamily: mono, color: C.dark }}>{fmt(stot(s))} ₺</span>
                      </div>
                      <div style={{ fontSize: 11, color: C.light, marginTop: 3, fontFamily: mono }}>
                        {elapsed(s.createdAt)} · {s.items.reduce((a, i) => a + i.qty, 0)} hizmet · {timerModeLabel(s.timerMode)}
                      </div>
                    </button>
                  ))}
                  {closed.length > 0 && (
                    <div style={{ borderTop: bd }}>
                      <div style={{ padding: "9px 14px", background: C.accentSoft }}>
                        <span style={{ fontSize: 10, color: C.light, letterSpacing: 1, fontFamily: mono }}>KAPALI — {closed.length}</span>
                      </div>
                      {closed.map((s) => (
                        <div key={s.id} style={{ padding: "10px 16px", borderBottom: bd, background: C.accentSoft, display: "flex", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: C.mid }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: C.light }}>{s.items.reduce((a, i) => a + i.qty, 0)} hizmet</div>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, fontFamily: mono, color: C.mid }}>{fmt(stot(s))} ₺</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ borderTop: bd, padding: "10px 12px", background: C.card, flexShrink: 0 }}>
                  <button type="button" onClick={() => setView("profile")} style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", border: "none", background: "transparent", padding: "4px", cursor: "pointer", textAlign: "left" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.dark, flexShrink: 0 }}>
                      {(profile.email || "?").charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.dark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile.email}</div>
                      <div style={{ fontSize: 10, color: C.light, fontFamily: mono }}>Profil ve ayarlar</div>
                    </div>
                  </button>
                </div>
              </div>
            {active && showCatalog && (
              <div style={{ width: "clamp(240px, 27vw, 280px)", minHeight: 0, borderRight: bd, display: "flex", flexDirection: "column", flexShrink: 0, background: C.card }}>
                <div style={{ display: "flex", flexWrap: "wrap", borderBottom: bd, padding: "6px 8px", gap: 4, flexShrink: 0 }}>
                  {pickerCats.map((c) => (
                    <button key={c.k} type="button" onClick={() => setCat(c.k)} style={{ padding: "5px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4, border: `1px solid ${cat === c.k ? C.dark : C.border}`, background: cat === c.k ? C.dark : "transparent", color: cat === c.k ? "#fff" : C.light, cursor: "pointer", transition: "all .12s" }}>
                      {c.l}
                    </button>
                  ))}
                </div>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {filtered.map((svc) => (
                    <button key={svc.id} type="button" className="dr" onClick={() => addItem(svc)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: "none", borderBottom: bd, background: "transparent", textAlign: "left", cursor: "pointer" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>{svc.name}</div>
                        {svc.dur > 0 && <div style={{ fontSize: 10, color: C.light }}>{svc.dur} dk</div>}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, fontFamily: mono, color: C.dark, flexShrink: 0 }}>{fmt(svc.price)} ₺</div>
                      <div style={{ width: 24, height: 24, borderRadius: 4, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: C.dark, flexShrink: 0 }}>+</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {active && showCartPanel && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0, background: C.card }}>
                <div style={{ padding: "12px 20px", borderBottom: bd, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.dark }}>{active.name}</div>
                    <div style={{ fontSize: 11, color: C.light, fontFamily: mono }}>
                      {elapsed(active.createdAt)} · {active.items.length} kalem · {timerModeLabel(active.timerMode)}
                    </div>
                  </div>
                </div>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {active.items.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 16px", color: C.light, fontSize: 13 }}>← Soldan hizmet ekleyin</div>
                  ) : (
                    active.items.map((item) => (
                      <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 20px", borderBottom: bd }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{item.name}</div>
                          <div style={{ fontSize: 11, color: C.light, fontFamily: mono }}>
                            {fmt(item.price)} ₺{item.qty > 1 ? ` × ${item.qty} = ${fmt(item.price * item.qty)} ₺` : ""}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                          <button type="button" onClick={() => changeQty(item.id, -1)} style={qtyBtn}>
                            −
                          </button>
                          <span style={{ fontSize: 13, fontWeight: 700, minWidth: 18, textAlign: "center", fontFamily: mono }}>{item.qty}</span>
                          <button type="button" onClick={() => changeQty(item.id, 1)} style={qtyBtn}>
                            +
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div style={{ borderTop: bd, padding: "14px 20px", flexShrink: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: canSendToPos ? 12 : 0 }}>
                    <span style={{ fontSize: 11, color: C.light, letterSpacing: 1, fontFamily: mono }}>TOPLAM</span>
                    <span style={{ fontSize: 26, fontWeight: 700, fontFamily: mono, color: C.dark }}>{fmt(stot(active))} ₺</span>
                  </div>
                  {canSendToPos ? (
                    <>
                      <button type="button" onClick={() => setShowPosModal(true)} style={{ width: "100%", marginBottom: 8, padding: "10px 14px", borderRadius: 5, border: `1px solid ${posTarget ? C.dark : C.border}`, background: posTarget ? C.accentSoft : "transparent", textAlign: "left", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: posTarget ? C.green : C.light }} />
                        <span style={{ fontSize: 12, fontWeight: 600, flex: 1, color: C.dark, minWidth: 0 }}>{posTarget ? posTarget.name : "POS cihazı seç..."}</span>
                        {posTarget && <span style={{ fontSize: 11, color: C.light, flexShrink: 0 }}>{posTarget.loc}</span>}
                        <span style={{ fontSize: 11, color: C.light }}>▾</span>
                      </button>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button type="button" onClick={() => { if (!posTarget) { setShowPosModal(true); return; } if (active?.items.length > 0 && !sending) setShowPosModal(true); }} disabled={active?.items.length === 0 || sending} style={{ flex: 1, minWidth: 120, padding: 12, fontSize: 12, fontWeight: 700, letterSpacing: 0.5, border: "none", borderRadius: 5, transition: "all .2s", background: sentOk ? C.green : active?.items.length === 0 ? C.accentSoft : C.dark, color: active?.items.length === 0 ? C.light : "#fff", cursor: active?.items.length === 0 || sending ? "not-allowed" : "pointer" }}>
                          {sending ? "GÖNDERİLİYOR..." : sentOk ? "GÖNDERİLDİ ✓" : "POS'A GÖNDER"}
                        </button>
                        {canCloseSession && (
                          <button type="button" onClick={() => setConfirmId(active.id)} disabled={sending} style={{ padding: "12px 14px", fontSize: 12, fontWeight: 700, letterSpacing: 0.4, border: bd, borderRadius: 5, background: "transparent", color: sending ? C.light : C.dark, cursor: sending ? "not-allowed" : "pointer" }}>
                            {closeSessionLabel}
                          </button>
                        )}
                      </div>
                    </>
                  ) : canCloseSession ? (
                    <button type="button" onClick={() => setConfirmId(active.id)} style={{ width: "100%", padding: 12, fontSize: 12, fontWeight: 700, letterSpacing: 0.5, border: "none", borderRadius: 5, transition: "all .2s", background: C.dark, color: "#fff", cursor: "pointer" }}>
                      {closeSessionLabel}
                    </button>
                  ) : null}
                </div>
              </div>
            )}
            {!active && (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: C.light, fontSize: 13, padding: 16, textAlign: "center" }}>← Bir oturum seçin veya yeni oturum açın</div>
            )}
          </div>
        )
      )}
      </div>

      </div>
    </div>
  );
}

export function DemoProfileScreen({ profile, onChange, onSave, onBack }: {
  profile: { email: string; phone: string; sector: string; password: string; defaultSliceMinutes: number };
  onChange: (p: { email: string; phone: string; sector: string; password: string; defaultSliceMinutes: number }) => void;
  onSave: () => void;
  onBack: () => void;
}) {
  const field = (label, child) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10, color: C.light, letterSpacing: 0.8, fontFamily: mono, marginBottom: 6 }}>{label}</div>
      {child}
    </div>
  );
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "clamp(16px, 4vw, 24px)", paddingBottom: "max(clamp(16px, 4vw, 24px), env(safe-area-inset-bottom))", maxWidth: 520, margin: "0 auto", width: "100%", minHeight: 0 }}>
      <button type="button" onClick={onBack} style={{ marginBottom: 12, border: "none", background: "transparent", color: C.mid, fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0 }}>
        ← Uygulamaya dön
      </button>
      <div style={{ fontSize: 10, color: C.light, letterSpacing: 1.2, fontFamily: mono, marginBottom: 8 }}>HESAP</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: C.dark, marginBottom: 6 }}>Profil ayarları</h2>
      <p style={{ fontSize: 13, color: C.mid, marginBottom: 22 }}>E-posta, iletişim ve sektör tercihi (demo).</p>
      {field("E-posta", (
        <input value={profile.email} onChange={(e) => onChange({ ...profile, email: e.target.value })} style={{ width: "100%", padding: "11px 12px", borderRadius: 8, border: bd, fontSize: 14, outline: "none", background: C.card, fontFamily: sans }} />
      ))}
      {field("Telefon", (
        <input value={profile.phone} onChange={(e) => onChange({ ...profile, phone: e.target.value })} placeholder="0532 000 00 00" style={{ width: "100%", padding: "11px 12px", borderRadius: 8, border: bd, fontSize: 14, outline: "none", background: C.card, fontFamily: sans }} />
      ))}
      {field("Yeni şifre", (
        <input type="password" value={profile.password} onChange={(e) => onChange({ ...profile, password: e.target.value })} placeholder="••••••••" style={{ width: "100%", padding: "11px 12px", borderRadius: 8, border: bd, fontSize: 14, outline: "none", background: C.card, fontFamily: sans }} />
      ))}
      {field("Sektör", (
        <select value={profile.sector} onChange={(e) => onChange({ ...profile, sector: e.target.value })} style={{ width: "100%", padding: "11px 12px", borderRadius: 8, border: bd, fontSize: 14, outline: "none", background: C.card, fontFamily: sans }}>
          {SECTORS.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      ))}
      {(profile.sector === "ps" || profile.sector === "net") && field("Saatlik dilim (dk)", (
        <input
          value={String(profile.defaultSliceMinutes)}
          onChange={(e) =>
            onChange({
              ...profile,
              defaultSliceMinutes: Math.max(1, Number.parseInt(e.target.value || "0", 10) || 60),
            })
          }
          placeholder="60"
          inputMode="numeric"
          style={{ width: "100%", padding: "11px 12px", borderRadius: 8, border: bd, fontSize: 14, outline: "none", background: C.card, fontFamily: sans }}
        />
      ))}
      <button type="button" onClick={onSave} className="cta" style={{ width: "100%", marginTop: 8, padding: 13, border: "none", borderRadius: 8, background: C.dark, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
        Kaydet
      </button>
    </div>
  );
}

/* ── POS MODAL ── */
export function PosModal({
  devices,
  selected,
  onSelect,
  onConfirm,
  sending,
  sentOk,
  onClose,
  activeItems,
  alignBottom,
}: {
  devices: typeof POS_DEVICES;
  selected: (typeof POS_DEVICES)[number] | null;
  onSelect: (p: (typeof POS_DEVICES)[number] | null) => void;
  onConfirm: () => void;
  sending: boolean;
  sentOk: boolean;
  onClose: () => void;
  activeItems: DemoServiceRow[] | undefined;
  alignBottom: boolean;
}) {
  const [local, setLocal] = useState(selected);
  const canSend = local && activeItems?.length > 0 && !sending;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(250,250,248,.92)",zIndex:9000,display:"flex",alignItems:alignBottom?"flex-end":"center",justifyContent:"center",padding:"max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left))",animation:"fadeIn .15s ease",overflowY:"auto"}}>
      <div style={{background:C.card,border:`2px solid ${C.dark}`,borderRadius:alignBottom?"12px 12px 0 0":12,width:"100%",maxWidth:480,maxHeight:"min(90dvh, 640px)",animation:"fadeUp .18s ease",overflowY:"auto",WebkitOverflowScrolling:"touch",margin:alignBottom?0:"auto"}}>
        <div style={{padding:"16px 20px",borderBottom:bd,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:10,color:C.light,letterSpacing:1.5,fontFamily:mono,marginBottom:2}}>POS CİHAZI SEÇ</div><div style={{fontSize:14,fontWeight:700,color:C.dark}}>Hangi cihaza gönderelim?</div></div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,color:C.light,cursor:"pointer"}}>×</button>
        </div>
        <div style={{padding:"10px 16px"}}>
          {devices.map(p=>{const isOff=p.st==="offline";const isSel=local?.id===p.id;return(
            <button key={p.id} disabled={isOff} onClick={()=>!isOff&&setLocal(p)} style={{width:"100%",marginBottom:8,padding:"12px 16px",borderRadius:8,border:`1.5px solid ${isSel?C.dark:C.border}`,background:isSel?C.accentSoft:C.bg,display:"flex",alignItems:"center",gap:12,opacity:isOff?.3:1,cursor:isOff?"not-allowed":"pointer",transition:"all .15s"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:p.st==="online"?C.green:p.st==="busy"?C.light:"#ccc"}} />
              <div style={{flex:1,textAlign:"left"}}><div style={{fontSize:13,fontWeight:700,color:C.dark}}>{p.name}</div><div style={{fontSize:11,color:C.light}}>{p.loc} · {p.st==="online"?"Aktif":p.st==="busy"?"Meşgul":"Çevrimdışı"}</div></div>
              {isSel&&<div style={{width:20,height:20,borderRadius:"50%",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11}}>✓</div>}
            </button>);})}
        </div>
        <div style={{padding:"12px 16px 20px",borderTop:bd}}>
          <button onClick={()=>{onSelect(local);onConfirm();}} disabled={!canSend} style={{width:"100%",padding:14,fontSize:13,fontWeight:700,borderRadius:8,border:"none",background:sentOk?C.green:(!canSend?C.accentSoft:C.dark),color:!canSend?C.light:"#fff",cursor:!canSend?"not-allowed":"pointer",transition:"all .2s"}}>
            {sending?"GÖNDERİLİYOR...":sentOk?"GÖNDERİLDİ ✓":local?`${local.name}'a Gönder`:"Cihaz seçin"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── SERVICES ADMIN ── */
export function ServicesAdmin({
  hasPos,
  services,
  setServices,
  categories,
  setCategories,
}: {
  hasPos: boolean;
  services: DemoServiceRow[];
  setServices: Dispatch<SetStateAction<DemoServiceRow[]>>;
  categories: { k: string; l: string }[];
  setCategories: Dispatch<SetStateAction<{ k: string; l: string }[]>>;
}) {
  const [subTab, setSubTab] = useState("services");
  const [newService, setNewService] = useState({ name: "", cat: categories[0]?.k || "", price: "", dur: "", kdv: "10" });
  const [newCategory, setNewCategory] = useState("");
  const [posDevices, setPosDevices] = useState(POS_DEVICES.map(p=>({...p})));
  const [filterCat, setFilterCat] = useState("all");
  const [toast, setToast] = useState(null);
  const showToast = (m)=>{setToast(m);setTimeout(()=>setToast(null),2000);};
  const catMap = Object.fromEntries(categories.map(c=>[c.k,c.l]));
  const filtered = filterCat==="all"?services:services.filter(s=>s.cat===filterCat);
  const toggleActive = (id)=>setServices(p=>p.map(s=>s.id===id?{...s,active:!s.active}:s));
  const deleteService = (id)=>{setServices(p=>p.filter(s=>s.id!==id));showToast("Silindi");};
  const deletePos = (id)=>{setPosDevices(p=>p.filter(d=>d.id!==id));showToast("Cihaz silindi");};
  const togglePos = (id)=>{setPosDevices(p=>p.map(d=>{if(d.id!==id)return d;return{...d,st:d.st==="online"?"offline":d.st==="offline"?"busy":"online"};}));};
  const sb = {padding:"5px 8px",fontSize:10,fontWeight:600,borderRadius:3,border:bd,background:"transparent",cursor:"pointer"};
  const tabs = hasPos?[["services","Hizmetler"],["categories","Kategoriler"],["pos","POS Cihazları"]]:[["services","Hizmetler"],["categories","Kategoriler"]];

  useEffect(() => {
    if (categories.some((c) => c.k === newService.cat)) return;
    setNewService((p) => ({ ...p, cat: categories[0]?.k || "" }));
  }, [categories, newService.cat]);

  useEffect(() => {
    if (filterCat === "all" || categories.some((c) => c.k === filterCat)) return;
    setFilterCat("all");
  }, [categories, filterCat]);

  const addCategory = () => {
    const clean = newCategory.trim();
    if (!clean) return;
    const key = clean.toLowerCase().replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ ]/gi, "").replace(/\s+/g, "-");
    if (!key) return;
    if (categories.some((c) => c.k === key)) {
      showToast("Bu kategori zaten var");
      return;
    }
    setCategories((p) => [...p, { k: key, l: clean }]);
    setNewService((p) => ({ ...p, cat: key }));
    setNewCategory("");
    showToast("Kategori eklendi");
  };

  const addService = () => {
    const name = newService.name.trim();
    const cat = newService.cat;
    const price = Number(newService.price);
    const dur = Number(newService.dur || 0);
    const kdv = Number(newService.kdv || 0);
    if (!name || !cat || Number.isNaN(price) || price <= 0) {
      showToast("Hizmet adı ve fiyat zorunlu");
      return;
    }
    const nextId = Math.max(0, ...services.map((s) => s.id)) + 1;
    setServices((p) => [...p, { id: nextId, name, cat, price, dur, kdv, active: true }]);
    setNewService((p) => ({ ...p, name: "", price: "", dur: "", kdv: p.kdv || "10" }));
    showToast("Yeni hizmet eklendi");
  };

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      {toast&&<div style={{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",background:C.dark,color:"#fff",padding:"9px 18px",borderRadius:6,fontSize:12,fontFamily:mono,zIndex:9999,animation:"fadeUp .18s ease"}}>{toast}</div>}
      <div style={{display:"flex",borderBottom:bd,flexShrink:0}}>
        {tabs.map(([t,l])=>(<button key={t} onClick={()=>setSubTab(t)} style={{flex:1,padding:"11px 8px",fontSize:11,fontWeight:600,letterSpacing:.4,background:"transparent",border:"none",borderBottom:subTab===t?`2px solid ${C.dark}`:"2px solid transparent",color:subTab===t?C.dark:C.light,cursor:"pointer"}}>{l.toUpperCase()}</button>))}
      </div>
      {subTab==="services"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:bd,background:C.accentSoft}}>
            <div style={{fontSize:11,color:C.light,fontFamily:mono,marginBottom:10}}>{services.length} hizmet · {services.filter(s=>s.active).length} aktif</div>
            <div style={{border:bd,borderRadius:10,padding:14,background:C.card}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:1,fontFamily:mono,color:C.mid,marginBottom:10}}>YENİ HİZMET</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <input value={newService.name} onChange={(e)=>setNewService((p)=>({...p,name:e.target.value}))} placeholder="Hizmet adı" style={{width:"100%",padding:"10px 12px",fontSize:13,border:bd,borderRadius:8,outline:"none",fontFamily:sans,background:C.bg}} />
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  <select value={newService.cat} onChange={(e)=>setNewService((p)=>({...p,cat:e.target.value}))} style={{flex:"1 1 160px",minWidth:0,padding:"10px 12px",fontSize:13,border:bd,borderRadius:8,outline:"none",fontFamily:sans,background:C.bg}}>
                    {categories.map((cat)=><option key={cat.k} value={cat.k}>{cat.l}</option>)}
                  </select>
                  <input value={newService.price} onChange={(e)=>setNewService((p)=>({...p,price:e.target.value}))} placeholder="Fiyat (₺)" inputMode="decimal" style={{flex:"1 1 100px",minWidth:0,padding:"10px 12px",fontSize:13,border:bd,borderRadius:8,outline:"none",fontFamily:sans,background:C.bg}} />
                  <input value={newService.dur} onChange={(e)=>setNewService((p)=>({...p,dur:e.target.value}))} placeholder="Süre (dk)" inputMode="numeric" style={{flex:"1 1 90px",minWidth:0,padding:"10px 12px",fontSize:13,border:bd,borderRadius:8,outline:"none",fontFamily:sans,background:C.bg}} />
                  <input value={newService.kdv} onChange={(e)=>setNewService((p)=>({...p,kdv:e.target.value}))} placeholder="KDV %" inputMode="numeric" style={{flex:"1 1 70px",minWidth:0,padding:"10px 12px",fontSize:13,border:bd,borderRadius:8,outline:"none",fontFamily:sans,background:C.bg}} />
                </div>
                <button type="button" onClick={addService} style={{width:"100%",padding:"11px 14px",fontSize:13,fontWeight:700,borderRadius:8,border:"none",background:C.dark,color:"#fff",cursor:"pointer"}}>Hizmeti listeye ekle</button>
              </div>
            </div>
          </div>
          <div style={{display:"flex",overflowX:"auto",borderBottom:bd,flexShrink:0}}>
            {[{k:"all",l:"Tümü"},...categories].map(c=>(<button key={c.k} onClick={()=>setFilterCat(c.k)} style={{padding:"9px 13px",fontSize:11,fontWeight:600,background:"transparent",border:"none",whiteSpace:"nowrap",borderBottom:filterCat===c.k?`2px solid ${C.dark}`:"2px solid transparent",color:filterCat===c.k?C.dark:C.light,cursor:"pointer"}}>{c.l.toUpperCase()}</button>))}
          </div>
          <div style={{flex:1,overflowY:"auto"}}>
            {filtered.map(svc=>(<div key={svc.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 16px",borderBottom:bd,opacity:svc.active?1:.45}}>
              <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}><span style={{fontSize:13,fontWeight:600,color:C.dark}}>{svc.name}</span><span style={{fontSize:9,color:C.light,background:C.accentSoft,padding:"2px 6px",borderRadius:3}}>{catMap[svc.cat]||svc.cat}</span>{!svc.active&&<span style={{fontSize:9,color:C.light}}>PASİF</span>}</div><div style={{fontSize:11,color:C.light,fontFamily:mono}}>{fmt(svc.price)} ₺{svc.kdv>0?` · KDV %${svc.kdv}`:""}{svc.dur?` · ${svc.dur}dk`:""}</div></div>
              <div style={{display:"flex",gap:4}}><button onClick={()=>toggleActive(svc.id)} style={{...sb,color:C.mid}}>{svc.active?"Pasif":"Aktif"}</button><button onClick={()=>deleteService(svc.id)} style={{...sb,color:C.red}}>Sil</button></div>
            </div>))}
          </div>
        </div>
      )}
      {subTab==="categories"&&(
        <div style={{flex:1,overflowY:"auto",padding:16}}>
          <div style={{fontSize:11,color:C.light,marginBottom:10}}>Hizmetleri gruplamak için kategoriler.</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12,alignItems:"stretch"}}>
            <input value={newCategory} onChange={(e)=>setNewCategory(e.target.value)} placeholder="Yeni kategori adı" style={{flex:"1 1 180px",minWidth:0,padding:"9px 11px",fontSize:12,border:bd,borderRadius:6,outline:"none",background:C.card,fontFamily:sans}} />
            <button type="button" onClick={addCategory} style={{padding:"9px 12px",fontSize:12,fontWeight:700,border:"none",borderRadius:6,background:C.dark,color:"#fff",cursor:"pointer",flex:"0 1 auto",alignSelf:"center"}}>Kategori Ekle</button>
          </div>
          {categories.map(cat=>(<div key={cat.k} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",border:bd,borderRadius:6,marginBottom:8}}>
            <span style={{flex:1,fontSize:13,fontWeight:600,color:C.dark}}>{cat.l}</span>
            <span style={{fontSize:11,color:C.light,fontFamily:mono}}>{services.filter(s=>s.cat===cat.k).length} hizmet</span>
          </div>))}
        </div>
      )}
      {subTab==="pos"&&hasPos&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"10px 16px",borderBottom:bd}}><div style={{fontSize:11,color:C.light,fontFamily:mono}}>{posDevices.length} cihaz · {posDevices.filter(d=>d.st==="online").length} aktif</div></div>
          <div style={{flex:1,overflowY:"auto"}}>
            {posDevices.map(pos=>(<div key={pos.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:bd}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:pos.st==="online"?C.green:pos.st==="busy"?C.light:"#ccc"}} />
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:C.dark}}>{pos.name}</div><div style={{fontSize:11,color:C.light}}>{pos.loc} · {pos.st==="online"?"AKTİF":pos.st==="busy"?"MEŞGUL":"KAPALI"}</div></div>
              <div style={{display:"flex",gap:4}}><button onClick={()=>togglePos(pos.id)} style={{...sb,color:C.mid}}>Durum</button><button onClick={()=>deletePos(pos.id)} style={{...sb,color:C.red}}>Sil</button></div>
            </div>))}
          </div>
        </div>
      )}
    </div>
  );
}
