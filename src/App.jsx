import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════
   DEFTER v2 — Full Landing + Dual Demo + Onboarding
   "Her İşletmenin Defteri Dijital Olsun"
═══════════════════════════════════════════════════════ */

const fmt = (n) => n.toLocaleString("tr-TR");

/* ─── PALETTE ─── */
const C = {
  bg: "#fafaf8", card: "#ffffff", dark: "#111110", dark2: "#2a2a28",
  mid: "#6b6b65", light: "#b5b5ae", border: "#e8e8e4",
  accent: "#1a1a18", accentSoft: "#f0f0ec", warm: "#e8e4dc",
  green: "#1a8c5b", greenSoft: "#e8f5ee",
  red: "#cc3333", redSoft: "#fce8e8",
};
const mono = "'DM Mono', monospace";
const sans = "'DM Sans', sans-serif";
const bd = `1px solid ${C.border}`;

/* ─── SECTOR DATA ─── */
const SECTORS = [
  { id: "hamam", icon: "♨", name: "Hamam & SPA", desc: "Kabine, hizmet ve paket yönetimi", session: "Kabine / Müşteri", unit: "Hizmet (dk bazlı)" },
  { id: "gym", icon: "◎", name: "Spor Salonu", desc: "Üyelik, giriş ve ekstra hizmetler", session: "Üye Girişi", unit: "Ders / Ekstra" },
  { id: "ps", icon: "▶", name: "PlayStation Cafe", desc: "Konsol kiralama ve market satışı", session: "Konsol / Masa", unit: "Saatlik + Ürün" },
  { id: "net", icon: "◻", name: "İnternet Cafe", desc: "Bilgisayar oturumları ve market", session: "PC No", unit: "Saatlik + Ürün" },
  { id: "kuru", icon: "◇", name: "Kuru Temizleme", desc: "Sipariş takibi ve teslim yönetimi", session: "Sipariş / Fiş", unit: "Parça bazlı" },
  { id: "cafe", icon: "◈", name: "Kafe & Restoran", desc: "Masa adisyonu ve menü yönetimi", session: "Masa / Adisyon", unit: "Menü Ürünleri" },
  { id: "rent", icon: "◐", name: "Saatlik Kiralama", desc: "Alan, oda ve ekipman rezarvasyonu", session: "Rezervasyon", unit: "Saat / Slot" },
  { id: "kuafor", icon: "✂", name: "Kuaför & Berber", desc: "Randevu ve personel yönetimi", session: "Randevu", unit: "Hizmet (dk bazlı)" },
];

/* ─── DEMO DATA ─── */
const DEMO_SERVICES = [
  { id: 1, cat: "hamam", name: "Klasik Hamam", price: 350, dur: 45 },
  { id: 2, cat: "hamam", name: "Köpük Masajı", price: 280, dur: 30 },
  { id: 3, cat: "hamam", name: "Kese", price: 180, dur: 20 },
  { id: 4, cat: "hamam", name: "Kese + Köpük", price: 420, dur: 45 },
  { id: 5, cat: "sauna", name: "Fin Saunası", price: 250, dur: 60 },
  { id: 6, cat: "sauna", name: "Buhar Odası", price: 200, dur: 40 },
  { id: 7, cat: "masaj", name: "Klasik Masaj", price: 450, dur: 60 },
  { id: 8, cat: "masaj", name: "Aromatik Masaj", price: 520, dur: 60 },
  { id: 9, cat: "kafeterya", name: "Bitki Çayı", price: 45, dur: 0 },
  { id: 10, cat: "kafeterya", name: "Meyve Tabağı", price: 85, dur: 0 },
  { id: 11, cat: "kafeterya", name: "Kahve", price: 55, dur: 0 },
  { id: 12, cat: "paket", name: "Kraliyet Paketi", price: 950, dur: 120 },
];
const POS_DEVICES = [
  { id: "p1", name: "Resepsiyon", loc: "Giriş", st: "online" },
  { id: "p2", name: "Hamam Kabini", loc: "Hamam Katı", st: "online" },
  { id: "p3", name: "Sauna Çıkışı", loc: "Sauna Katı", st: "busy" },
  { id: "p4", name: "Kafeterya", loc: "Kafeterya", st: "online" },
  { id: "p5", name: "Masaj Odası", loc: "Masaj Katı", st: "offline" },
];
const WEEKLY = [
  { d: "Pzt", v: 98 }, { d: "Sal", v: 112 }, { d: "Çar", v: 145 },
  { d: "Per", v: 128 }, { d: "Cum", v: 198 }, { d: "Cmt", v: 243 }, { d: "Paz", v: 220 },
];

/* ─── ONBOARDING STEPS ─── */
const ONBOARD_STEPS = [
  { title: "Sektörünüzü Seçin", desc: "8+ hazır şablondan işletmenize uygun olanı seçin. Terminoloji, kategoriler ve iş akışı otomatik yüklensin.", color: "#f0ece4", icon: "◉" },
  { title: "Hizmetlerinizi Tanımlayın", desc: "Menünüzü, fiyatları, süreleri ve kategorileri kolayca ekleyin. KDV hesaplaması otomatik.", color: "#e4ecf0", icon: "▤" },
  { title: "Oturum Açın, Hizmet Ekleyin", desc: "Müşteri/masa/kabine açın, hizmetleri sepete ekleyin. Süre sayacı arka planda çalışır.", color: "#e4f0e8", icon: "◫" },
  { title: "Analiz & Raporlama", desc: "Günlük ciro, en çok satan hizmetler, doluluk oranı — tek panelden takip edin.", color: "#f0e4ec", icon: "◩" },
  { title: "POS ile Ödeme Alın", desc: "Opsiyonel POS modülüyle cihazınıza tek tıkla ödeme gönderin. Çoklu cihaz desteği.", color: "#ece4f0", icon: "⬡" },
];

const APP_ONBOARD_STEPS = [
  { id: "sector", title: "Sektör seçimi", desc: "Terminoloji ve varsayılan şablonları otomatik yükleyelim." },
  { id: "business", title: "İşletme bilgisi", desc: "Demo işletme adı ve oturum etiketini belirleyin." },
  { id: "ready", title: "Başlangıç kurulumu", desc: "Hizmetler, kategoriler ve kaynaklar örnek verilerle hazır." },
];

const TEMPLATE_PRESETS = {
  hamam: {
    sessionLabel: "Kabine / Müşteri",
    resourceLabel: "Kabine",
    categories: [
      { k: "hamam", l: "Hamam" },
      { k: "sauna", l: "Sauna" },
      { k: "masaj", l: "Masaj" },
      { k: "kafeterya", l: "Kafeterya" },
      { k: "paket", l: "Paketler" },
    ],
    services: DEMO_SERVICES,
  },
  ps: {
    sessionLabel: "Konsol / Masa",
    resourceLabel: "Konsol",
    categories: [
      { k: "konsol", l: "Konsol" },
      { k: "market", l: "Market" },
      { k: "paket", l: "Paket" },
    ],
    services: [
      { id: 101, cat: "konsol", name: "PS5 1 Saat", price: 170, dur: 60 },
      { id: 102, cat: "konsol", name: "PS5 VIP 1 Saat", price: 230, dur: 60 },
      { id: 103, cat: "market", name: "Enerji İçeceği", price: 65, dur: 0 },
      { id: 104, cat: "market", name: "Cips", price: 45, dur: 0 },
      { id: 105, cat: "paket", name: "3 Saat Turnuva Paketi", price: 420, dur: 180 },
    ],
  },
  cafe: {
    sessionLabel: "Masa / Adisyon",
    resourceLabel: "Masa",
    categories: [
      { k: "icecek", l: "İçecek" },
      { k: "yiyecek", l: "Yiyecek" },
      { k: "tatli", l: "Tatlı" },
    ],
    services: [
      { id: 201, cat: "icecek", name: "Latte", price: 110, dur: 0 },
      { id: 202, cat: "icecek", name: "Filtre Kahve", price: 95, dur: 0 },
      { id: 203, cat: "yiyecek", name: "Club Sandviç", price: 180, dur: 0 },
      { id: 204, cat: "tatli", name: "San Sebastian", price: 165, dur: 0 },
    ],
  },
};

const getTemplatePreset = (sectorId) => {
  const preset = TEMPLATE_PRESETS[sectorId] || TEMPLATE_PRESETS.hamam;
  return {
    ...preset,
    categories: preset.categories.map((c) => ({ ...c })),
    services: preset.services.map((s) => ({ ...s })),
  };
};

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => (typeof window !== "undefined" ? window.matchMedia(query).matches : false));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    if (mq.addEventListener) {
      mq.addEventListener("change", on);
      return () => mq.removeEventListener("change", on);
    }
    mq.addListener(on);
    return () => mq.removeListener(on);
  }, [query]);
  return matches;
}

/** Demo POS mobil düzeni: therma benzeri liste↔detay. Sadece innerWidth güvenilir değil (ör. dar panel + geniş window, visualViewport, tablet ~768px). */
const DEMO_MOBILE_BREAKPOINT = 1024;

function readCompactViewportWidth() {
  if (typeof window === "undefined") return 1920;
  const el = document.documentElement;
  const vv = window.visualViewport;
  return Math.min(
    window.innerWidth,
    el.clientWidth || window.innerWidth,
    vv?.width ?? window.innerWidth,
  );
}

function isDemoMobileLayout() {
  if (typeof window === "undefined") return false;
  const w = readCompactViewportWidth();
  const mq = window.matchMedia(`(max-width: ${DEMO_MOBILE_BREAKPOINT - 1}px)`).matches;
  return mq || w < DEMO_MOBILE_BREAKPOINT;
}

function useThermaMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? isDemoMobileLayout() : false,
  );

  useLayoutEffect(() => {
    const sync = () => setIsMobile(isDemoMobileLayout());
    sync();
    window.addEventListener("resize", sync, { passive: true });
    window.addEventListener("orientationchange", sync);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", sync);
    vv?.addEventListener("scroll", sync);
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => sync())
        : null;
    ro?.observe(document.documentElement);
    const root = document.getElementById("root");
    if (root) ro?.observe(root);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
      vv?.removeEventListener("resize", sync);
      vv?.removeEventListener("scroll", sync);
      ro?.disconnect();
    };
  }, []);

  return isMobile;
}

/** Oturum listesi sekmesi: şablon kaynak etiketi + sektöre göre (sabit "MASALAR" yok). */
function getSessionsNavLabel(resourceLabel, sectorId) {
  const lower = (resourceLabel || "").toLowerCase();
  if (/masa|adisyon/.test(lower)) return "MASALAR";
  if (/kabine|müşteri|musteri|spa/.test(lower)) return "KABİNELER";
  if (/konsol|playstation|ps/.test(lower)) return "KONSOLLAR";
  if (/pc|bilgisayar|no\b/.test(lower)) return "PC'LER";
  if (/sipariş|siparis|fiş|fis|kuru/.test(lower)) return "SİPARİŞLER";
  if (/rezervasyon|alan|oda|saatlik kiralama/.test(lower)) return "REZERVASYONLAR";
  if (/randevu|kuaför|kuafor|berber/.test(lower)) return "RANDEVULAR";
  if (/üye|uye|spor|gym|giriş|giris/.test(lower)) return "GİRİŞLER";
  const bySector = {
    hamam: "KABİNELER", gym: "GİRİŞLER", ps: "KONSOLLAR", net: "PC'LER",
    kuru: "SİPARİŞLER", cafe: "MASALAR", rent: "REZERVASYONLAR", kuafor: "RANDEVULAR",
  };
  if (sectorId && bySector[sectorId]) return bySector[sectorId];
  return "OTURUMLAR";
}

/* ═══════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const [demoMode, setDemoMode] = useState(null);
  const [landingUser, setLandingUser] = useState(null);
  const [showLandingLogin, setShowLandingLogin] = useState(false);
  const openDemo = (mode) => { setDemoMode(mode); setPage("demo"); };
  if (page === "demo") {
    return (
      <DemoExperience
        mode={demoMode}
        onBack={() => setPage("home")}
        landingUser={landingUser}
        onUserChange={setLandingUser}
      />
    );
  }
  return (
    <>
      <LandingPage
        onDemo={openDemo}
        landingUser={landingUser}
        onOpenLogin={() => setShowLandingLogin(true)}
        onLogout={() => setLandingUser(null)}
      />
      {/* Login akisi gecici olarak kapatildi.
      {showLandingLogin && (
        <LandingLoginModal
          onClose={() => setShowLandingLogin(false)}
          onSuccess={(u) => {
            setLandingUser(u);
            setShowLandingLogin(false);
            openDemo("temel");
          }}
        />
      )} */}
    </>
  );
}

function DemoExperience({ mode, onBack, landingUser, onUserChange }) {
  const [stage, setStage] = useState("onboarding");
  const [setup, setSetup] = useState(null);

  if (stage === "onboarding") {
    return (
      <AppOnboarding
        onBack={onBack}
        onComplete={(payload) => {
          setSetup(payload);
          setStage("app");
        }}
      />
    );
  }

  return (
    <DemoApp
      mode={mode}
      onBack={onBack}
      setup={setup}
      landingUser={landingUser}
      onUserChange={onUserChange}
    />
  );
}

function LandingLoginModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState("demo@defter.app");
  const [password, setPassword] = useState("123456");
  const canLogin = email.trim() && password.trim().length >= 4;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(250,250,248,.92)", zIndex: 9500, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: sans }}>
      <div style={{ width: "100%", maxWidth: 420, background: C.card, border: `2px solid ${C.dark}`, borderRadius: 14, padding: 28, position: "relative" }}>
        <button type="button" onClick={onClose} style={{ position: "absolute", top: 16, right: 16, border: "none", background: "none", fontSize: 20, color: C.light, cursor: "pointer" }}>×</button>
        <div style={{ fontSize: 11, color: C.light, letterSpacing: 1.5, fontFamily: mono, marginBottom: 6 }}>GİRİŞ</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.dark, marginBottom: 8 }}>Hesabınıza giriş yapın</div>
        <div style={{ fontSize: 13, color: C.mid, marginBottom: 18 }}>Demo ve iletişim için örnek alanlar.</div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: C.light, letterSpacing: 1, fontFamily: mono, marginBottom: 6 }}>E-POSTA</div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "11px 12px", borderRadius: 6, border: bd, fontSize: 14, outline: "none", background: C.bg, fontFamily: sans }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: C.light, letterSpacing: 1, fontFamily: mono, marginBottom: 6 }}>ŞİFRE</div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "11px 12px", borderRadius: 6, border: bd, fontSize: 14, outline: "none", background: C.bg, fontFamily: sans }} />
        </div>
        <button
          type="button"
          onClick={() => canLogin && onSuccess({ email, phone: "", sector: "hamam" })}
          disabled={!canLogin}
          className="cta"
          style={{ width: "100%", padding: 13, border: "none", borderRadius: 8, background: canLogin ? C.dark : C.border, color: canLogin ? "#fff" : C.light, fontWeight: 700, cursor: canLogin ? "pointer" : "not-allowed" }}
        >
          Giriş Yap
        </button>
      </div>
    </div>
  );
}

function AppOnboarding({ onBack, onComplete }) {
  const [step, setStep] = useState(0);
  const [sector, setSector] = useState("hamam");
  const [businessName, setBusinessName] = useState("Defter Demo Şubesi");
  const [sessionLabel, setSessionLabel] = useState("Kabine");
  const current = APP_ONBOARD_STEPS[step];
  const preset = getTemplatePreset(sector);
  const obNarrow = useMediaQuery("(max-width: 640px)");

  const next = () => {
    if (step < APP_ONBOARD_STEPS.length - 1) {
      setStep((p) => p + 1);
      return;
    }
    onComplete({
      sector,
      businessName: businessName.trim() || "Defter Demo Şubesi",
      sessionLabel: sessionLabel.trim() || preset.resourceLabel,
      template: preset,
    });
  };

  return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, fontFamily: sans, padding: "max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left))" }}>
      <div style={{ width: "100%", maxWidth: 720, background: C.card, border: `2px solid ${C.dark}`, borderRadius: 14, padding: "clamp(16px, 4vw, 28px)", maxHeight: "min(100dvh - 24px, 900px)", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 18, flexWrap: obNarrow ? "wrap" : "nowrap" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: C.light, letterSpacing: 1.5, fontFamily: mono, marginBottom: 6 }}>ONBOARDING {step + 1}/{APP_ONBOARD_STEPS.length}</div>
            <div style={{ fontSize: "clamp(18px, 4.5vw, 24px)", fontWeight: 700, color: C.dark, lineHeight: 1.2 }}>{current.title}</div>
            <div style={{ fontSize: 13, color: C.mid, marginTop: 6, lineHeight: 1.45 }}>{current.desc}</div>
          </div>
          <button type="button" onClick={onBack} style={{ border: "none", background: "none", fontSize: 22, color: C.light, cursor: "pointer", flexShrink: 0, lineHeight: 1, padding: 4 }} aria-label="Geri">←</button>
        </div>

        {current.id === "sector" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 140px), 1fr))", gap: 10 }}>
            {SECTORS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSector(s.id);
                  const nextPreset = getTemplatePreset(s.id);
                  setSessionLabel(nextPreset.resourceLabel);
                }}
                style={{ padding: 12, borderRadius: 8, border: `1px solid ${sector === s.id ? C.dark : C.border}`, background: sector === s.id ? C.accentSoft : C.bg, cursor: "pointer", textAlign: "left" }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>{s.name}</div>
                <div style={{ fontSize: 11, color: C.light, marginTop: 2 }}>{s.session}</div>
              </button>
            ))}
          </div>
        )}

        {current.id === "business" && (
          <div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: C.light, letterSpacing: 1, fontFamily: mono, marginBottom: 6 }}>İŞLETME ADI</div>
              <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} style={{ width: "100%", padding: "11px 12px", borderRadius: 6, border: bd, fontSize: 14, outline: "none", background: C.bg, fontFamily: sans }} />
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.light, letterSpacing: 1, fontFamily: mono, marginBottom: 6 }}>OTURUM ETİKETİ</div>
              <input value={sessionLabel} onChange={(e) => setSessionLabel(e.target.value)} style={{ width: "100%", padding: "11px 12px", borderRadius: 6, border: bd, fontSize: 14, outline: "none", background: C.bg, fontFamily: sans }} />
            </div>
          </div>
        )}

        {current.id === "ready" && (
          <div style={{ border: bd, borderRadius: 10, padding: 16, background: C.bg }}>
            <div style={{ fontSize: 12, color: C.mid, marginBottom: 10 }}>Seçilen şablon ile otomatik yüklenecek:</div>
            <div style={{ display: "grid", gridTemplateColumns: obNarrow ? "1fr" : "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
              <div style={{ fontSize: 13, color: C.dark, wordBreak: "break-word" }}>• {preset.categories.length} kategori</div>
              <div style={{ fontSize: 13, color: C.dark, wordBreak: "break-word" }}>• {preset.services.length} hizmet</div>
              <div style={{ fontSize: 13, color: C.dark, wordBreak: "break-word" }}>• Session etiketi: {sessionLabel}</div>
              <div style={{ fontSize: 13, color: C.dark, wordBreak: "break-word" }}>• Kaynak tipi: {preset.resourceLabel}</div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: obNarrow ? "column-reverse" : "row", justifyContent: "space-between", alignItems: obNarrow ? "stretch" : "center", marginTop: 20, gap: 10 }}>
          <button type="button" onClick={() => setStep((p) => Math.max(0, p - 1))} disabled={step === 0} style={{ padding: "10px 16px", borderRadius: 6, border: bd, background: "transparent", color: step === 0 ? C.light : C.dark, cursor: step === 0 ? "not-allowed" : "pointer", width: obNarrow ? "100%" : undefined }}>Geri</button>
          <button type="button" onClick={next} className="cta" style={{ padding: "12px 16px", borderRadius: 6, border: "none", background: C.dark, color: "#fff", fontWeight: 700, cursor: "pointer", width: obNarrow ? "100%" : undefined }}>{step === APP_ONBOARD_STEPS.length - 1 ? "Uygulamayı Başlat" : "Devam Et"}</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════════════════ */
function LandingPage({ onDemo, landingUser, onOpenLogin, onLogout }) {
  const [scrollY, setScrollY] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [showDemoPicker, setShowDemoPicker] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const fn = () => setScrollY(el.scrollTop);
    el.addEventListener("scroll", fn, { passive: true });
    return () => el.removeEventListener("scroll", fn);
  }, []);

  return (
    <div ref={ref} style={{ height: "100vh", overflowY: "auto", background: C.bg, fontFamily: sans }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth} body{background:${C.bg}}
        ::selection{background:${C.dark};color:#fff}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .fu{animation:fadeUp .6s ease both}
        .fu1{animation:fadeUp .6s .1s ease both}
        .fu2{animation:fadeUp .6s .2s ease both}
        .fu3{animation:fadeUp .6s .3s ease both}
        .fu4{animation:fadeUp .6s .4s ease both}
        .sc:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(0,0,0,.06)}
        .cta:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(0,0,0,.15)}
        .ghost:hover{background:${C.dark}!important;color:#fff!important}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:${C.light};border-radius:2px}
      `}</style>

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
      {showDemoPicker && <DemoPickerModal onClose={() => setShowDemoPicker(false)} onPick={(m) => { setShowDemoPicker(false); onDemo(m); }} />}

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: scrollY > 40 ? "rgba(250,250,248,.92)" : "transparent",
        backdropFilter: scrollY > 40 ? "blur(20px)" : "none",
        borderBottom: scrollY > 40 ? bd : "1px solid transparent",
        transition: "all .3s", padding: "0 clamp(16px,4vw,48px)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: -1, color: C.dark }}>defter</span>
            <span style={{ fontSize: 10, color: C.light, fontFamily: mono, letterSpacing: 1 }}>v1.0</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Gecici: landing login/giris aksiyonlari kapatildi.
            {landingUser ? (
              <span style={{ padding: "8px 18px", fontSize: 12, fontWeight: 500, color: C.mid, fontFamily: mono, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={landingUser.email}>{landingUser.email}</span>
            ) : (
              <button type="button" onClick={() => onOpenLogin?.()} className="ghost" style={{ padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: `1.5px solid ${C.border}`, background: "transparent", color: C.dark, cursor: "pointer", transition: "all .2s" }}>Giriş</button>
            )}
            {landingUser && (
              <button type="button" onClick={onLogout} style={{ padding: "8px 12px", fontSize: 12, fontWeight: 600, borderRadius: 6, border: "none", background: "transparent", color: C.light, cursor: "pointer" }}>Çıkış</button>
            )} */}
            <button onClick={() => setShowDemoPicker(true)} className="ghost" style={{ padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: `1.5px solid ${C.dark}`, background: "transparent", color: C.dark, cursor: "pointer", transition: "all .2s" }}>Demo</button>
            <button onClick={() => setShowContact(true)} className="cta" style={{ padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: C.dark, color: "#fff", cursor: "pointer", transition: "all .2s" }}>Başla</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: "clamp(48px,8vw,100px) clamp(16px,4vw,48px) clamp(40px,6vw,80px)", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "clamp(32px,4vw,64px)", alignItems: "center", flexWrap: "wrap" }}>
          <div className="fu" style={{ flex: "1 1 400px", minWidth: 300 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: C.light, fontFamily: mono, marginBottom: 20 }}>OTOMASYON PLATFORMU</div>
            <h1 style={{ fontSize: "clamp(32px,5vw,58px)", fontWeight: 700, lineHeight: 1.08, letterSpacing: -2, color: C.dark, marginBottom: 20 }}>Her işletmenin<br />defteri dijital olsun.</h1>
            <p className="fu1" style={{ fontSize: "clamp(15px,1.8vw,19px)", lineHeight: 1.6, color: C.mid, maxWidth: 480, marginBottom: 32 }}>Hamam, kafe, spor salonu, PlayStation cafe — sektör fark etmez.<br />Oturum aç, hizmet ekle, ödemeyi al.</p>
            <div className="fu2" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => setShowContact(true)} className="cta" style={{ padding: "14px 32px", fontSize: 15, fontWeight: 700, borderRadius: 8, border: "none", background: C.dark, color: "#fff", cursor: "pointer", transition: "all .2s" }}>Hemen Başla</button>
              <button onClick={() => setShowDemoPicker(true)} className="ghost" style={{ padding: "14px 32px", fontSize: 15, fontWeight: 600, borderRadius: 8, border: `1.5px solid ${C.border}`, background: "transparent", color: C.dark, cursor: "pointer", transition: "all .2s" }}>Canlı Demo →</button>
            </div>
            <div className="fu3" style={{ display: "flex", gap: "clamp(20px,3vw,40px)", marginTop: 48, flexWrap: "wrap" }}>
              {[{ v: "8+", l: "Sektör" }, { v: "∞", l: "Oturum" }, { v: "1×", l: "Yıllık Ödeme" }].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 28, fontWeight: 700, fontFamily: mono, color: C.dark, letterSpacing: -1 }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: C.light, marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Hero Mock */}
          <div className="fu4" style={{ flex: "1 1 360px", minWidth: 300, maxWidth: 520 }}>
            <div style={{ borderRadius: 14, border: bd, background: C.card, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.06), 0 1px 3px rgba(0,0,0,.04)" }}>
              <div style={{ height: 40, borderBottom: bd, display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
                <div style={{ display: "flex", gap: 5 }}>
                  {["#ff5f57","#ffbd2e","#28ca42"].map((c,i) => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />)}
                </div>
                <span style={{ fontSize: 11, fontFamily: mono, color: C.light, marginLeft: 8 }}>defter — Hamam & SPA</span>
              </div>
              <div style={{ display: "flex", height: 280 }}>
                <div style={{ width: "40%", borderRight: bd, padding: 10 }}>
                  <div style={{ fontSize: 8, color: C.light, fontFamily: mono, letterSpacing: 1, marginBottom: 8 }}>AÇIK — 3</div>
                  {["Kabine 1", "Ahmet Bey", "VIP Oda"].map((n, i) => (
                    <div key={i} style={{ padding: "8px 10px", marginBottom: 4, borderRadius: 6, background: i === 0 ? C.accentSoft : "transparent", borderLeft: i === 0 ? `3px solid ${C.dark}` : "3px solid transparent" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.dark }}>{n}</div>
                      <div style={{ fontSize: 9, color: C.light, fontFamily: mono }}>{["1.250 ₺","680 ₺","2.100 ₺"][i]}</div>
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1, padding: 10 }}>
                  <div style={{ fontSize: 9, color: C.light, fontFamily: mono, letterSpacing: 1, marginBottom: 6 }}>SEPET — KABİNE 1</div>
                  {[{ n: "Kese + Köpük", p: "420 ₺" },{ n: "Fin Saunası", p: "250 ₺" },{ n: "Aromatik Masaj", p: "520 ₺" },{ n: "Bitki Çayı ×2", p: "90 ₺" }].map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: 10, color: C.dark }}>{item.n}</span>
                      <span style={{ fontSize: 10, fontFamily: mono, fontWeight: 600, color: C.dark }}>{item.p}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 8, borderTop: `1.5px solid ${C.dark}` }}>
                    <span style={{ fontSize: 10, color: C.light, fontFamily: mono }}>TOPLAM</span>
                    <span style={{ fontSize: 16, fontWeight: 700, fontFamily: mono, color: C.dark }}>1.280 ₺</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ONBOARDING CAROUSEL */}
      <section style={{ padding: "clamp(40px,6vw,80px) clamp(16px,4vw,48px)", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: C.light, fontFamily: mono, marginBottom: 12 }}>NASIL BAŞLANIR</div>
        <h2 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 700, letterSpacing: -1, color: C.dark, marginBottom: 36, lineHeight: 1.1 }}>5 adımda<br />tam kontrol.</h2>
        <OnboardingCarousel />
      </section>

      {/* SECTORS */}
      <section style={{ padding: "clamp(40px,6vw,80px) clamp(16px,4vw,48px)", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: C.light, fontFamily: mono, marginBottom: 12 }}>SEKTÖRLER</div>
        <h2 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 700, letterSpacing: -1, color: C.dark, marginBottom: 12, lineHeight: 1.1 }}>Bir şablon seç,<br />hemen başla.</h2>
        <p style={{ fontSize: 15, color: C.mid, marginBottom: 36, maxWidth: 480, lineHeight: 1.5 }}>Her sektörün terminolojisi, kategorileri ve iş akışı hazır.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {SECTORS.map(s => (
            <div key={s.id} className="sc" style={{ padding: 20, borderRadius: 10, border: bd, background: C.card, cursor: "default", transition: "all .25s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{s.icon}</div>
                <div><div style={{ fontSize: 15, fontWeight: 700, color: C.dark }}>{s.name}</div><div style={{ fontSize: 11, color: C.light }}>{s.desc}</div></div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[["OTURUM",s.session],["BİRİM",s.unit]].map(([l,v]) => (
                  <div key={l} style={{ flex: 1, padding: "8px 10px", borderRadius: 6, background: C.accentSoft }}>
                    <div style={{ fontSize: 9, color: C.light, fontFamily: mono, letterSpacing: .5, marginBottom: 2 }}>{l}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.dark }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "clamp(40px,6vw,80px) clamp(16px,4vw,48px)", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: C.light, fontFamily: mono, marginBottom: 12 }}>ÖZELLİKLER</div>
        <h2 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 700, letterSpacing: -1, color: C.dark, marginBottom: 36, lineHeight: 1.1 }}>Her şey tek panelde.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          {[
            { i: "▤", t: "Oturum Yönetimi", d: "Müşteri, masa, kabine açın. Sepete hizmet ekleyin, süre takibi yapın." },
            { i: "◫", t: "Hizmet & Kategori", d: "Sınırsız hizmet, özel kategoriler, KDV hesaplaması, aktif/pasif kontrolü." },
            { i: "◎", t: "Durum Akışı", d: "OPEN → IN_PROGRESS → PENDING_PAYMENT → CLOSED adımlarıyla net süreç." },
            { i: "◧", t: "İndirim & Kampanya", d: "Sepet bazlı indirimler ve kampanya kurallarıyla kontrollü fiyatlandırma." },
            { i: "✎", t: "Notlar & Etiketler", d: "Oturum ve siparişlere operasyon notları ve etiketler ekleyin." },
            { i: "◩", t: "Analitik & Rapor", d: "Ciro, doluluk, en çok satan hizmetler — haftalık ve günlük grafikler." },
            { i: "⌂", t: "Kaynak Yönetimi", d: "Masa/konsol/kabine/oda durumları: boş, dolu, bakımda, rezerve." },
            { i: "⬡", t: "POS Entegrasyonu", d: "Birden fazla POS cihazı tanımlayın, tek tıkla ödeme gönderin." },
            { i: "⚑", t: "Kullanıcı Yönetimi", d: "Personel rolleri ve erişim seviyeleri için yönetim tabanlı yapı." },
            { i: "◱", t: "Template Engine", d: "Sektör şablonlarıyla kurulum sihirbazı: seç, yükle, özelleştir." },
            { i: "☁", t: "Offline-first Hazırlık", d: "Bağlantı kesilse de operasyonu sürdürecek senaryolara uygun kurgu." },
            { i: "◳", t: "Responsive", d: "Masaüstü, tablet, telefon — her cihazda sorunsuz çalışır." },
          ].map((f, i) => (
            <div key={i} style={{ padding: 22, borderRadius: 10, border: bd, background: C.card }}>
              <div style={{ fontSize: 22, marginBottom: 10, color: C.dark }}>{f.i}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 6 }}>{f.t}</div>
              <div style={{ fontSize: 13, color: C.mid, lineHeight: 1.55 }}>{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: "clamp(40px,6vw,80px) clamp(16px,4vw,48px)", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: C.light, fontFamily: mono, marginBottom: 12 }}>FİYATLANDIRMA</div>
        <h2 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 700, letterSpacing: -1, color: C.dark, marginBottom: 36, lineHeight: 1.1 }}>Basit, şeffaf.</h2>
        <div className="pricing-grid" style={{ maxWidth: 920, margin: "0 auto" }}>
          <PricingCard label="TEMEL" price="10.000 ₺" sub="" desc="Yılda bir ödeme, geri kalanı sınırsız." features={["Sınırsız oturum","Tüm sektör şablonları","Hizmet & kategori yönetimi","Analitik & raporlama","Responsive web app"]} onAction={() => setShowContact(true)} />
          <PricingCard label="TEMEL + POS" price="20.000 ₺" sub="" desc="Otomasyon + entegre POS ödeme." features={["Temel'deki her şey","POS cihaz entegrasyonu","Çoklu cihaz desteği","Ödeme durumu takibi","Cihaz yönetim paneli"]} highlight onAction={() => setShowContact(true)} />
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "clamp(60px,8vw,100px) clamp(16px,4vw,48px)", maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 700, letterSpacing: -1.5, color: C.dark, marginBottom: 16, lineHeight: 1.1 }}>Kağıt defter devri bitti.</h2>
        <p style={{ fontSize: 16, color: C.mid, marginBottom: 32, maxWidth: 420, margin: "0 auto 32px" }}>İşletmenizi dakikalar içinde dijitale taşıyın.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setShowContact(true)} className="cta" style={{ padding: "16px 40px", fontSize: 16, fontWeight: 700, borderRadius: 8, border: "none", background: C.dark, color: "#fff", cursor: "pointer", transition: "all .2s" }}>Ücretsiz Dene</button>
          <button onClick={() => setShowDemoPicker(true)} className="ghost" style={{ padding: "16px 40px", fontSize: 16, fontWeight: 600, borderRadius: 8, border: `1.5px solid ${C.border}`, background: "transparent", color: C.dark, cursor: "pointer", transition: "all .2s" }}>Canlı Demo →</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: bd, padding: "32px clamp(16px,4vw,48px)", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div><span style={{ fontSize: 18, fontWeight: 700, letterSpacing: -.5, color: C.dark }}>defter</span><span style={{ fontSize: 12, color: C.light, marginLeft: 12 }}>© 2026</span></div>
          <div style={{ fontSize: 12, color: C.light }}>Her işletmenin defteri dijital olsun.</div>
        </div>
      </footer>
    </div>
  );
}

/* ── ONBOARDING CAROUSEL ── */
function OnboardingCarousel() {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);
  const reset = useCallback(() => { clearInterval(timerRef.current); timerRef.current = setInterval(() => setIdx(p => (p+1) % ONBOARD_STEPS.length), 5000); }, []);
  useEffect(() => { reset(); return () => clearInterval(timerRef.current); }, [reset]);
  const go = (i) => { setIdx(i); reset(); };
  const step = ONBOARD_STEPS[idx];
  return (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 400px", minWidth: 280, height: 320, borderRadius: 14, background: step.color, border: bd, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .5s ease", position: "relative" }}>
        <div style={{ textAlign: "center", animation: "fadeIn .4s ease" }} key={idx}>
          <div style={{ fontSize: 48, marginBottom: 12, opacity: .3 }}>{step.icon}</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.dark, opacity: .5 }}>{step.title}</div>
          <div style={{ fontSize: 11, color: C.mid, marginTop: 4, opacity: .4 }}>Video / Ekran görüntüsü alanı</div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(0,0,0,.06)" }}>
          <div style={{ height: "100%", background: C.dark, borderRadius: 2, width: `${((idx+1)/ONBOARD_STEPS.length)*100}%`, transition: "width .5s ease" }} />
        </div>
      </div>
      <div style={{ flex: "1 1 300px", minWidth: 260 }}>
        {ONBOARD_STEPS.map((s, i) => (
          <button key={i} onClick={() => go(i)} style={{ width: "100%", padding: "14px 16px", borderRadius: 8, marginBottom: 6, border: i===idx ? `1.5px solid ${C.dark}` : "1px solid transparent", background: i===idx ? C.card : "transparent", boxShadow: i===idx ? "0 2px 12px rgba(0,0,0,.04)" : "none", textAlign: "left", cursor: "pointer", transition: "all .25s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: i===idx ? C.dark : C.accentSoft, color: i===idx ? "#fff" : C.light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: mono, flexShrink: 0, transition: "all .25s" }}>{i+1}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: i===idx ? C.dark : C.mid, transition: "color .2s" }}>{s.title}</div>
                {i===idx && <div style={{ fontSize: 12, color: C.mid, marginTop: 3, lineHeight: 1.5, animation: "fadeIn .3s ease" }}>{s.desc}</div>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── PRICING CARD ── */
function PricingCard({ label, price, sub, desc, features, highlight, onAction }) {
  return (
    <div style={{ padding: 28, borderRadius: 12, background: C.card, position: "relative", border: highlight ? `2px solid ${C.dark}` : bd }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: C.light, fontFamily: mono, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 36, fontWeight: 700, color: C.dark, fontFamily: mono, letterSpacing: -2, marginBottom: 4 }}>{price}<span style={{ fontSize: 14, color: C.light, fontWeight: 400 }}> {sub}</span></div>
      <div style={{ fontSize: 13, color: C.mid, marginBottom: 20 }}>{desc}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {features.map((f,i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.dark }}><span style={{ fontWeight: 700, fontSize: 11 }}>✓</span> {f}</div>)}
      </div>
      <button onClick={onAction} className="cta" style={{ width: "100%", padding: 12, fontSize: 13, fontWeight: 700, borderRadius: 6, border: "none", background: highlight ? C.dark : C.accentSoft, color: highlight ? "#fff" : C.dark, cursor: "pointer", transition: "all .2s" }}>Hemen Başla</button>
    </div>
  );
}

/* ── CONTACT MODAL ── */
function ContactModal({ onClose }) {
  const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [sent, setSent] = useState(false);
  const ok = name.trim() && phone.trim();
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(250,250,248,.92)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, animation: "fadeIn .15s ease" }}>
      <div style={{ background: C.card, border: `2px solid ${C.dark}`, borderRadius: 14, padding: 32, width: "100%", maxWidth: 420, animation: "fadeUp .2s ease", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 20, color: C.light, cursor: "pointer" }}>×</button>
        {!sent ? (<>
          <div style={{ fontSize: 10, color: C.light, letterSpacing: 1.5, fontFamily: mono, marginBottom: 8 }}>İLETİŞİM</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.dark, marginBottom: 4 }}>Hemen Başlayın</div>
          <div style={{ fontSize: 13, color: C.mid, marginBottom: 24, lineHeight: 1.5 }}>Bilgilerinizi bırakın, 24 saat içinde size ulaşalım.</div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: C.light, fontFamily: mono, letterSpacing: 1, marginBottom: 5 }}>AD SOYAD *</div>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ahmet Yılmaz" style={{ width: "100%", padding: "11px 13px", fontSize: 14, border: bd, borderRadius: 6, outline: "none", fontFamily: sans, background: C.bg }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10, color: C.light, fontFamily: mono, letterSpacing: 1, marginBottom: 5 }}>TELEFON *</div>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="0532 123 45 67" style={{ width: "100%", padding: "11px 13px", fontSize: 14, border: bd, borderRadius: 6, outline: "none", fontFamily: sans, background: C.bg }} />
          </div>
          <button onClick={() => ok && setSent(true)} className="cta" style={{ width: "100%", padding: 14, fontSize: 14, fontWeight: 700, borderRadius: 8, border: "none", background: ok ? C.dark : C.border, color: ok ? "#fff" : C.light, cursor: ok ? "pointer" : "not-allowed", transition: "all .2s" }}>Gönder</button>
        </>) : (
          <div style={{ textAlign: "center", padding: "20px 0", animation: "fadeUp .3s ease" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.greenSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28, color: C.green }}>✓</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.dark, marginBottom: 8 }}>Talebiniz Alındı</div>
            <div style={{ fontSize: 14, color: C.mid, lineHeight: 1.5 }}>24 saat içinde tarafınıza<br />ulaşılacaktır.</div>
            <button onClick={onClose} style={{ marginTop: 24, padding: "12px 32px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: bd, background: "transparent", color: C.dark, cursor: "pointer" }}>Kapat</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── DEMO PICKER ── */
function DemoPickerModal({ onClose, onPick }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(250,250,248,.92)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: "max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left))", animation: "fadeIn .15s ease", overflowY: "auto" }}>
      <div style={{ background: C.card, border: `2px solid ${C.dark}`, borderRadius: 14, padding: "clamp(18px, 4vw, 32px)", width: "100%", maxWidth: 480, maxHeight: "min(92dvh, 720px)", overflowY: "auto", WebkitOverflowScrolling: "touch", animation: "fadeUp .2s ease", position: "relative", margin: "auto 0" }}>
        <button type="button" onClick={onClose} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", fontSize: 22, color: C.light, cursor: "pointer", padding: 8, lineHeight: 1 }} aria-label="Kapat">×</button>
        <div style={{ fontSize: 10, color: C.light, letterSpacing: 1.5, fontFamily: mono, marginBottom: 8, paddingRight: 36 }}>DEMO SEÇ</div>
        <div style={{ fontSize: "clamp(18px, 4vw, 22px)", fontWeight: 700, color: C.dark, marginBottom: 4, lineHeight: 1.2 }}>Hangi planı denemek istersiniz?</div>
        <div style={{ fontSize: 13, color: C.mid, marginBottom: 20, lineHeight: 1.45 }}>Demo verilerle dolu, istediğiniz gibi kurcalayın.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button type="button" onClick={() => onPick("temel")} className="sc" style={{ padding: "16px 18px", borderRadius: 10, border: bd, background: C.bg, textAlign: "left", cursor: "pointer", transition: "all .15s", width: "100%" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 3 }}>Temel</div>
            <div style={{ fontSize: 12, color: C.mid, lineHeight: 1.4 }}>Oturum yönetimi, hizmetler, analitik — POS olmadan</div>
          </button>
          <button type="button" onClick={() => onPick("pos")} className="sc" style={{ padding: "16px 18px", paddingTop: 22, borderRadius: 10, border: `2px solid ${C.dark}`, background: C.card, textAlign: "left", cursor: "pointer", transition: "all .15s", position: "relative", width: "100%" }}>
            <div style={{ position: "absolute", top: -1, right: 12, background: C.dark, color: "#fff", padding: "3px 10px", borderRadius: "0 0 5px 5px", fontSize: 9, fontWeight: 600 }}>+ POS</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 3 }}>Temel + POS</div>
            <div style={{ fontSize: 12, color: C.mid, lineHeight: 1.4 }}>Her şey dahil — POS cihaz yönetimi ve ödeme gönderme</div>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DEMO APP — Full functional with Temel / Temel+POS modes
   Mobil: therma-pos benzeri liste ↔ detay + hizmet alt sheet
═══════════════════════════════════════════════════════ */
let _sid = 100;
const mkSess = (n) => ({ id: _sid++, name: n, items: [], createdAt: new Date(), closedAt: null, status: "open" });

/** Alt sheet: hizmet seçimi (mobil detay) */
function DemoServiceDrawer({ pickerCats, cat, setCat, filtered, onAddService, onClose }) {
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
function DemoMobileSessionDetail({
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
  hasPos,
  pickerCats,
  qtyBtn,
  sessionTotal,
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
              <div style={{ fontSize: 12, marginTop: 10 }}>Aşağıdan «Hizmet Ekle» ile başlayın.</div>
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
            <span style={{ fontSize: 16 }}>+</span> Hizmet Ekle
          </button>
          {hasPos ? (
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
                <button
                  type="button"
                  onClick={() => active.items.length > 0 && setConfirmId(active.id)}
                  disabled={active.items.length === 0 || sending}
                  style={{
                    padding: "12px 14px",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 0.4,
                    border: bd,
                    borderRadius: 5,
                    background: "transparent",
                    color: active.items.length === 0 ? C.light : C.dark,
                    cursor: active.items.length === 0 || sending ? "not-allowed" : "pointer",
                  }}
                >
                  ÇEK KAPAT
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => active.items.length > 0 && setConfirmId(active.id)}
              disabled={active.items.length === 0}
              style={{
                width: "100%",
                padding: 12,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.5,
                border: "none",
                borderRadius: 5,
                background: active.items.length === 0 ? C.accentSoft : C.dark,
                color: active.items.length === 0 ? C.light : "#fff",
                cursor: active.items.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              ÇEK KAPAT
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function DemoApp({ mode, onBack, setup, landingUser, onUserChange }) {
  const template = setup?.template || getTemplatePreset("hamam");
  const sectorId = setup?.sector || "hamam";
  const businessName = setup?.businessName || "Demo Şube";
  const sessionLabel = setup?.sessionLabel || template.resourceLabel || "Oturum";
  const sessionsNavLabel = getSessionsNavLabel(template.resourceLabel || sessionLabel, sectorId);
  const [view, setView] = useState("sessions");
  const [sessions, setSessions] = useState(() => [mkSess(`${sessionLabel} 1`), mkSess(`${sessionLabel} 2`)]);
  const [activeId, setActiveId] = useState(null);
  const [cat, setCat] = useState("all");
  const [serviceCatalog, setServiceCatalog] = useState(() => template.services.map((s) => ({ kdv: 10, active: true, ...s })));
  const [serviceCategories, setServiceCategories] = useState(template.categories);
  const [profile, setProfile] = useState(() => ({
    email: landingUser?.email || "demo@defter.app",
    phone: landingUser?.phone || "",
    sector: setup?.sector || landingUser?.sector || sectorId,
    password: "",
  }));
  const [toast, setToast] = useState(null);
  const [addingName, setAddingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [showPosModal, setShowPosModal] = useState(false);
  const [posTarget, setPosTarget] = useState(null);
  const [sending, setSending] = useState(false);
  const [sentOk, setSentOk] = useState(false);
  const isMobile = useThermaMobile();
  /** Mobil: oturum listesi vs sepet/detay (therma-pos ile uyumlu) */
  const [sessionUi, setSessionUi] = useState("list");

  useEffect(() => {
    if (view !== "sessions") setSessionUi("list");
  }, [view]);

  useEffect(() => {
    if (!landingUser?.email) return;
    setProfile((p) => ({ ...p, email: landingUser.email, phone: landingUser.phone || p.phone, sector: landingUser.sector || p.sector }));
  }, [landingUser]);

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 2200); };
  const open = sessions.filter(s => s.status === "open");
  const closed = sessions.filter(s => s.status === "closed");
  const active = sessions.find(s => s.id === activeId);

  useEffect(() => {
    if (!active && sessionUi === "detail") setSessionUi("list");
  }, [active, sessionUi]);

  const stot = (s) => s.items.reduce((a, i) => a + i.price * i.qty, 0);
  const elapsed = (d) => { const m = Math.floor((Date.now()-d)/60000); return m<1?"az önce":`${m}dk`; };
  const pickerCats = [{ k: "all", l: "Tümü" }, ...serviceCategories];
  const filtered = (cat === "all" ? serviceCatalog : serviceCatalog.filter((s) => s.cat === cat)).filter((s) => s.active !== false);
  const maxW = Math.max(...WEEKLY.map(d => d.v));
  const closedRevenue = closed.reduce((a, s) => a + stot(s), 0);
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
  const qtyBtn = { width: 26, height: 26, borderRadius: 4, border: bd, background: C.accentSoft, color: C.dark, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 };

  useEffect(() => {
    if (pickerCats.some((c) => c.k === cat)) return;
    setCat("all");
  }, [pickerCats, cat]);

  const addSession = () => {
    const n = newName.trim() || `${sessionLabel} ${sessions.length + 1}`;
    const s = mkSess(n);
    setSessions((p) => [...p, s]);
    setNewName("");
    setAddingName(false);
    setActiveId(s.id);
    setView("sessions");
    if (isMobile) setSessionUi("detail");
    showToast(`"${n}" açıldı`);
  };
  const addItem = useCallback((svc) => { setSessions(p => p.map(s => { if(s.id!==activeId) return s; const ex=s.items.find(i=>i.id===svc.id); return {...s, items: ex ? s.items.map(i=>i.id===svc.id?{...i,qty:i.qty+1}:i) : [...s.items,{...svc,qty:1}]}; })); showToast(`+ ${svc.name}`); }, [activeId]);
  const changeQty = (itemId, delta) => { setSessions(p => p.map(s => { if(s.id!==activeId) return s; return {...s, items: s.items.map(i=>i.id===itemId?{...i,qty:i.qty+delta}:i).filter(i=>i.qty>0)}; })); };
  const closeSession = (sid) => {
    setSessions((p) => p.map((s) => (s.id === sid ? { ...s, status: "closed", closedAt: new Date() } : s)));
    setConfirmId(null);
    showToast("Çek kapatıldı ✓");
    const rem = open.filter((s) => s.id !== sid);
    setActiveId(rem.length ? rem[0].id : null);
    if (isMobile) setSessionUi("list");
  };
  const sendToPos = async () => { if(!posTarget||!active||active.items.length===0) return; setShowPosModal(false); setSending(true); await new Promise(r=>setTimeout(r,1500)); setSending(false); setSentOk(true); showToast(`${posTarget.name} → gönderildi ✓`); setTimeout(()=>setSentOk(false),3000); };

  const handleHeaderBack = () => {
    if (view === "profile") { setView("sessions"); return; }
    if (isMobile && view === "sessions" && sessionUi === "detail") { setSessionUi("list"); return; }
    onBack();
  };

  const showCatalog = Boolean(active && !isMobile);
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
            <div style={{fontSize:10,color:C.light,letterSpacing:1.5,fontFamily:mono,marginBottom:8}}>ÇEK KAPAT</div>
            <div style={{fontSize:22,fontWeight:700,color:C.dark,marginBottom:4}}>{s.name}</div>
            <div style={{fontSize:32,fontWeight:700,fontFamily:mono,color:C.dark,marginBottom:6}}>{fmt(stot(s))} ₺</div>
            <div style={{fontSize:12,color:C.mid,marginBottom:24}}>{s.items.length} kalem · {s.items.reduce((a,i)=>a+i.qty,0)} adet</div>
            <div style={{display:"flex",flexDirection:isMobile?"column-reverse":"row",gap:8}}>
              <button type="button" onClick={()=>setConfirmId(null)} style={{flex:1,padding:12,fontSize:13,fontWeight:600,borderRadius:6,border:bd,background:"transparent",color:C.dark,cursor:"pointer",width:isMobile?"100%":undefined}}>İptal</button>
              <button type="button" onClick={()=>closeSession(confirmId)} style={{flex:1,padding:12,fontSize:13,fontWeight:700,borderRadius:6,border:"none",background:C.dark,color:"#fff",cursor:"pointer",width:isMobile?"100%":undefined}}>Tahsil Et & Kapat</button>
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
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))",gap:10}}>
            {[
              { l: "Kapalı ciro", v: `${fmt(closedRevenue)} ₺`, d: `${closed.length} kapalı` },
              { l: "Açık tahmini", v: `${fmt(openRevenue)} ₺`, d: `${open.length} açık oturum` },
              { l: "Toplam işlem", v: String(closed.length + open.length), d: "oturum kaydı" },
              { l: "Ort. sepet (kapalı)", v: closed.length ? `${fmt(Math.round(closedRevenue / closed.length))} ₺` : "—", d: "kapananlar" },
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
                              {elapsed(s.createdAt)} · {s.items.reduce((a, i) => a + i.qty, 0)} hizmet
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
                hasPos={hasPos}
                pickerCats={pickerCats}
                qtyBtn={qtyBtn}
                sessionTotal={stot}
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
                        {elapsed(s.createdAt)} · {s.items.reduce((a, i) => a + i.qty, 0)} hizmet
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
                      {elapsed(active.createdAt)} · {active.items.length} kalem
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: hasPos ? 12 : 0 }}>
                    <span style={{ fontSize: 11, color: C.light, letterSpacing: 1, fontFamily: mono }}>TOPLAM</span>
                    <span style={{ fontSize: 26, fontWeight: 700, fontFamily: mono, color: C.dark }}>{fmt(stot(active))} ₺</span>
                  </div>
                  {hasPos ? (
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
                        <button type="button" onClick={() => active.items.length > 0 && setConfirmId(active.id)} disabled={active.items.length === 0 || sending} style={{ padding: "12px 14px", fontSize: 12, fontWeight: 700, letterSpacing: 0.4, border: bd, borderRadius: 5, background: "transparent", color: active.items.length === 0 ? C.light : C.dark, cursor: active.items.length === 0 || sending ? "not-allowed" : "pointer" }}>
                          ÇEK KAPAT
                        </button>
                      </div>
                    </>
                  ) : (
                    <button type="button" onClick={() => active.items.length > 0 && setConfirmId(active.id)} disabled={active.items.length === 0} style={{ width: "100%", padding: 12, fontSize: 12, fontWeight: 700, letterSpacing: 0.5, border: "none", borderRadius: 5, transition: "all .2s", background: active.items.length === 0 ? C.accentSoft : C.dark, color: active.items.length === 0 ? C.light : "#fff", cursor: active.items.length === 0 ? "not-allowed" : "pointer" }}>
                      ÇEK KAPAT
                    </button>
                  )}
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

function DemoProfileScreen({ profile, onChange, onSave, onBack }) {
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
      <button type="button" onClick={onSave} className="cta" style={{ width: "100%", marginTop: 8, padding: 13, border: "none", borderRadius: 8, background: C.dark, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
        Kaydet
      </button>
    </div>
  );
}

/* ── POS MODAL ── */
function PosModal({ devices, selected, onSelect, onConfirm, sending, sentOk, onClose, activeItems, alignBottom }) {
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
function ServicesAdmin({ hasPos, services, setServices, categories, setCategories }) {
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
