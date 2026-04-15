import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { C, bd, mono, ONBOARD_STEPS, sans, SECTORS } from '@/shared/constants/demo.constants';
import { useLandingSeo } from '@/shared/hooks/use-landing-seo.hook';
import { FAQ_LANDING_ITEMS } from '@/shared/seo/faq-landing.data';
import { LandingHeroMedia } from '@/screens/landing/landing-hero-media';
import { LandingMvpSectors } from '@/screens/landing/landing-mvp-sectors';
import { LandingProductStory } from '@/screens/landing/landing-product-story';
import { appendContactLead } from '@/shared/storage/contact-leads.storage';
import { LandingJsonLd } from '@/shared/seo/landing-json-ld';

export default function LandingScreen() {
  const [scrollY, setScrollY] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [showDemoPicker, setShowDemoPicker] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const fn = () => setScrollY(el.scrollTop);
    el.addEventListener("scroll", fn, { passive: true });
    return () => el.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!showDemoPicker) return;
    void import('@/screens/demo/onboarding/demo-onboarding.screen');
  }, [showDemoPicker]);

  useLandingSeo();

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

      <LandingJsonLd />

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
      {showDemoPicker && (
        <DemoPickerModal onClose={() => setShowDemoPicker(false)} />
      )}

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: scrollY > 40 ? "rgba(250,250,248,.92)" : "transparent",
        backdropFilter: scrollY > 40 ? "blur(20px)" : "none",
        borderBottom: scrollY > 40 ? bd : "1px solid transparent",
        transition: "all .3s", padding: "0 clamp(16px,4vw,48px)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(12px,3vw,28px)", flexWrap: "wrap", minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: -1, color: C.dark }}>defter</span>
              <span style={{ fontSize: 10, color: C.light, fontFamily: mono, letterSpacing: 1 }}>v1.0</span>
            </div>
            <nav aria-label="Bölümler" style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <a href="#urun-akisi" style={{ fontSize: 12, fontWeight: 500, color: C.mid, textDecoration: "none", whiteSpace: "nowrap" }}>
                Ürün akışı
              </a>
              <a href="#sektorler" style={{ fontSize: 12, fontWeight: 500, color: C.mid, textDecoration: "none", whiteSpace: "nowrap" }}>
                Sektörler
              </a>
              <a href="#ozellikler" style={{ fontSize: 12, fontWeight: 500, color: C.mid, textDecoration: "none", whiteSpace: "nowrap" }}>
                Özellikler
              </a>
            </nav>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
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

      <main id="main-content">
      {/* 1 — HERO */}
      <section
        id="hero"
        style={{
          padding: "clamp(40px,7vw,96px) clamp(16px,4vw,48px) clamp(48px,8vw,88px)",
          maxWidth: 1200,
          margin: "0 auto",
          background: `linear-gradient(180deg, ${C.accentSoft} 0%, ${C.bg} 48%, ${C.bg} 100%)`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(28px,5vw,52px)" }}>
          <div className="fu" style={{ maxWidth: 720 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: C.light, fontFamily: mono, marginBottom: 16 }}>
              KAĞIT ADİSYONUN DİJİTALİ
            </div>
            <h1
              style={{
                fontSize: "clamp(34px, 5.2vw, 60px)",
                fontWeight: 700,
                lineHeight: 1.06,
                letterSpacing: -2,
                color: C.dark,
                marginBottom: 18,
              }}
            >
              Fişe ne yazıyorsanız,
              <br />
              ekranda da görünür.
            </h1>
            <p style={{ fontSize: "clamp(16px, 1.85vw, 19px)", lineHeight: 1.55, color: C.dark, marginBottom: 14 }}>
              <strong>Defter</strong> randevu değil, CRM değil: açık işlem açın, içine ürün ve hizmet yazın, süreçte tutun, tahsilatla kapatın. Kağıt
              adisyon, kabin fişi veya iş takip kartının aynısı — dijital.
            </p>
            <p className="fu1" style={{ fontSize: "clamp(15px,1.75vw,18px)", lineHeight: 1.65, color: C.mid, maxWidth: 560 }}>
              Kafe, PlayStation / internet cafe, hamam veya bilardo — Faz 1 şablonlarıyla demoyu deneyin. Yol haritasındaki diğer sektörler şablon sırasıyla eklenir.
            </p>
          </div>

          <div className="fu2" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={() => setShowContact(true)}
              className="cta"
              style={{
                padding: "15px 36px",
                fontSize: 15,
                fontWeight: 700,
                borderRadius: 10,
                border: "none",
                background: C.dark,
                color: "#fff",
                cursor: "pointer",
                transition: "all .2s",
              }}
            >
              Hemen Başla
            </button>
            <button
              onClick={() => setShowDemoPicker(true)}
              className="ghost"
              style={{
                padding: "15px 36px",
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 10,
                border: `1.5px solid ${C.border}`,
                background: "transparent",
                color: C.dark,
                cursor: "pointer",
                transition: "all .2s",
              }}
            >
              Canlı Demo →
            </button>
          </div>

          <div className="fu3" style={{ display: "flex", gap: "clamp(24px,4vw,48px)", flexWrap: "wrap" }}>
            {[{ v: "5", l: "Faz 1 şablon" }, { v: "∞", l: "İşlem" }, { v: "1×", l: "Yıllık ödeme" }].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 30, fontWeight: 700, fontFamily: mono, color: C.dark, letterSpacing: -1 }}>{s.v}</div>
                <div style={{ fontSize: 11, color: C.light, marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1b — ÜRÜN AKIŞI */}
      <section
        id="urun-akisi"
        style={{
          padding: "clamp(40px,7vw,80px) clamp(16px,4vw,48px)",
          maxWidth: 1200,
          margin: "0 auto",
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: C.light, fontFamily: mono, marginBottom: 12 }}>
          ÜRÜNÜN ÖZÜ
        </div>
        <h2 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 700, letterSpacing: -1, color: C.dark, marginBottom: 14, lineHeight: 1.1 }}>
          Kağıt kullanan işletmeye
          <br />
          uygun.
        </h2>
        <p style={{ fontSize: 15, color: C.mid, marginBottom: 28, maxWidth: 560, lineHeight: 1.55 }}>
          Oturum motoru tek; şablon ise hangi terimlerle konuşacağınızı ve hangi kaynakları (masa, kabin, PC) listeden seçeceğinizi belirler. Yeni
          sektör için soru: bugün kağıda yazıyor mu, açık hesabı takip ediyor mu?
        </p>
        <LandingProductStory />
      </section>

      {/* 2 — TANITIM VİDEOSU */}
      <section
        id="tanitim"
        style={{
          padding: "clamp(48px,8vw,96px) clamp(16px,4vw,48px)",
          maxWidth: 1200,
          margin: "0 auto",
          borderTop: `1px solid ${C.border}`,
          background: `linear-gradient(180deg, ${C.bg} 0%, ${C.accentSoft}35 50%, ${C.bg} 100%)`,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: C.light, fontFamily: mono, marginBottom: 12 }}>
          TANITIM
        </div>
        <h2 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 700, letterSpacing: -1, color: C.dark, marginBottom: 14, lineHeight: 1.1 }}>
          Ürünü kısa bir kayıtta
          <br />
          izleyin.
        </h2>
        <p style={{ fontSize: 15, color: C.mid, marginBottom: 28, maxWidth: 560, lineHeight: 1.55 }}>
          Arayüz, akış ve sektör örnekleri — tek bakışta Defter’in ne olduğunu görün.
        </p>
        <LandingHeroMedia />
      </section>

      {/* 3 — NASIL ÇALIŞIR */}
      <section
        id="nasil-baslanir"
        style={{
          padding: "clamp(52px,8vw,100px) clamp(16px,4vw,48px)",
          maxWidth: 1200,
          margin: "0 auto",
          background: `linear-gradient(180deg, ${C.bg} 0%, ${C.accentSoft}40 18%, ${C.bg} 72%)`,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: C.light, fontFamily: mono, marginBottom: 12 }}>
          NASIL ÇALIŞIR
        </div>
        <h2 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 700, letterSpacing: -1, color: C.dark, marginBottom: 14, lineHeight: 1.1 }}>
          Kurulum sırası,
          <br />
          adım adım.
        </h2>
        <p style={{ fontSize: 15, color: C.mid, marginBottom: 28, maxWidth: 560, lineHeight: 1.55 }}>
          Tanıtımı izledikten sonra aşağıdaki adımlar, şablon seçiminden rapora kadar gidişatın kısa özeti.
        </p>
        <OnboardingCarousel />
      </section>

      {/* 4 — KİMLER İÇİN: sektör şablonları */}
      <section
        id="sektorler"
        style={{
          padding: "clamp(52px,8vw,96px) clamp(16px,4vw,48px)",
          maxWidth: 1200,
          margin: "0 auto",
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: C.light, fontFamily: mono, marginBottom: 12 }}>
          KİMLER İÇİN
        </div>
        <h2 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 700, letterSpacing: -1, color: C.dark, marginBottom: 12, lineHeight: 1.1 }}>
          Ne iş yapıyorsunuz?
          <br />
          Sadece size uygun akışı gösterelim.
        </h2>
        <LandingMvpSectors sectors={SECTORS} />
      </section>

      {/* 5 — ÖZELLİKLER */}
      <section
        id="ozellikler"
        style={{
          padding: "clamp(48px,8vw,96px) clamp(16px,4vw,48px)",
          maxWidth: 1200,
          margin: "0 auto",
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: C.light, fontFamily: mono, marginBottom: 12 }}>
          ÖZELLİKLER
        </div>
        <h2 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 700, letterSpacing: -1, color: C.dark, marginBottom: 12, lineHeight: 1.1 }}>
          Her şey tek panelde.
        </h2>
        <p style={{ fontSize: 15, color: C.mid, marginBottom: 32, maxWidth: 560, lineHeight: 1.55 }}>
          Şu an demoda gördükleriniz çekirdek ve şablon katmanı; POS ve derin entegrasyonlar planda ayrı paket olarak ilerler.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          {[
            { i: "▤", t: "Şablon + sektör dili", d: "İşletme tipine göre etiketler, kategoriler ve örnek hizmetler; tek çekirdekte tutarlı deneyim." },
            { i: "⌂", t: "Hazır kaynak listesi", d: "Anahtar, masa, PC veya masa — önceden tanımlı listeden seçerek açın; gerekirse sonra yenisini ekleyin." },
            { i: "◫", t: "Oturum + sepet", d: "Açık oturumda hizmet kalemleri, miktar ve toplam; kapanışta tahsilat akışı." },
            { i: "◎", t: "Durum akışı", d: "OPEN → IN_PROGRESS → PENDING_PAYMENT → CLOSED ile net süreç; demo içinde canlı." },
            { i: "⏱", t: "Sayaç + dilim (PS / Net)", d: "Profilde dilim süresi; yukarı sayaçta otomatik hizmet eşleşmesi veya sabit paket süresi dolunca uyarı." },
            { i: "◩", t: "Analitik özeti", d: "Kapalı ciro, açık tahmini ve en çok satan kalemler — demo verilerle örnek." },
            { i: "⬡", t: "POS (plan)", d: "Temel + POS demosunda cihaz seçimi ve gönderim akışı; canlıda entegrasyon yol haritası." },
            { i: "◱", t: "Template motoru", d: "Kod içi şablon sözleşmesi; ileride JSONB ile genişletilebilir yapı." },
            { i: "◳", t: "Responsive", d: "Masaüstü ve mobil; demo akışı tek ekranda." },
          ].map((f, i) => (
            <div key={i} style={{ padding: 22, borderRadius: 10, border: bd, background: C.card }}>
              <div style={{ fontSize: 22, marginBottom: 10, color: C.dark }}>{f.i}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 6 }}>{f.t}</div>
              <div style={{ fontSize: 13, color: C.mid, lineHeight: 1.55 }}>{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 6 — FİYAT */}
      <section
        id="fiyatlandirma"
        style={{
          padding: "clamp(48px,8vw,96px) clamp(16px,4vw,48px)",
          maxWidth: 1200,
          margin: "0 auto",
          background: `linear-gradient(180deg, ${C.bg} 0%, ${C.accentSoft}35 40%, ${C.bg} 100%)`,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: C.light, fontFamily: mono, marginBottom: 12 }}>
          FİYATLANDIRMA
        </div>
        <h2 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 700, letterSpacing: -1, color: C.dark, marginBottom: 12, lineHeight: 1.1 }}>
          Basit, şeffaf.
        </h2>
        <p style={{ fontSize: 15, color: C.mid, marginBottom: 36, maxWidth: 480, lineHeight: 1.5 }}>
          Yıllık tek ödeme; demo ile içeriği görüp karar verin.
        </p>
        <div className="pricing-grid" style={{ maxWidth: 920, margin: "0 auto" }}>
          <PricingCard label="TEMEL" price="10.000 ₺" sub="" desc="Yılda bir ödeme, geri kalanı sınırsız." features={["Sınırsız operasyon","Tüm sektör şablonları","Hizmet & kategori yönetimi","Analitik & raporlama","Responsive web app"]} onAction={() => setShowContact(true)} />
          <PricingCard label="TEMEL + POS" price="20.000 ₺" sub="" desc="Otomasyon + entegre POS ödeme." features={["Temel'deki her şey","POS cihaz entegrasyonu","Çoklu cihaz desteği","Ödeme durumu takibi","Cihaz yönetim paneli"]} highlight onAction={() => setShowContact(true)} />
        </div>
      </section>

      {/* 7 — SSS */}
      <section
        id="sss"
        aria-labelledby="sss-heading"
        style={{
          padding: "clamp(48px,8vw,96px) clamp(16px,4vw,48px)",
          maxWidth: 900,
          margin: "0 auto",
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: C.light, fontFamily: mono, marginBottom: 12 }}>SSS</div>
        <h2 id="sss-heading" style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 700, letterSpacing: -1, color: C.dark, marginBottom: 24, lineHeight: 1.15 }}>
          Sıkça sorulan sorular
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {FAQ_LANDING_ITEMS.map((item, i) => (
            <article key={i} style={{ padding: "18px 20px", borderRadius: 10, border: bd, background: C.card }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 8 }}>{item.question}</h3>
              <p style={{ fontSize: 14, color: C.mid, lineHeight: 1.55, margin: 0 }}>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 8 — SON CTA */}
      <section
        id="cta"
        style={{
          padding: "clamp(56px,9vw,100px) clamp(16px,4vw,48px)",
          maxWidth: 1200,
          margin: "0 auto",
          textAlign: "center",
          background: `linear-gradient(180deg, ${C.accentSoft}50 0%, ${C.bg} 100%)`,
        }}
      >
        <h2 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 700, letterSpacing: -1.5, color: C.dark, marginBottom: 16, lineHeight: 1.1 }}>Kağıt defter devri bitti.</h2>
        <p style={{ fontSize: 16, color: C.mid, marginBottom: 32, maxWidth: 420, margin: "0 auto 32px" }}>İşletmenizi dakikalar içinde dijitale taşıyın.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setShowContact(true)} className="cta" style={{ padding: "16px 40px", fontSize: 16, fontWeight: 700, borderRadius: 8, border: "none", background: C.dark, color: "#fff", cursor: "pointer", transition: "all .2s" }}>Ücretsiz Dene</button>
          <button onClick={() => setShowDemoPicker(true)} className="ghost" style={{ padding: "16px 40px", fontSize: 16, fontWeight: 600, borderRadius: 8, border: `1.5px solid ${C.border}`, background: "transparent", color: C.dark, cursor: "pointer", transition: "all .2s" }}>Canlı Demo →</button>
        </div>
      </section>
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: bd, padding: "32px clamp(16px,4vw,48px)", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div><span style={{ fontSize: 18, fontWeight: 700, letterSpacing: -.5, color: C.dark }}>defter</span><span style={{ fontSize: 12, color: C.light, marginLeft: 12 }}>© 2026</span></div>
          <nav aria-label="Sayfa bölümleri" style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", justifyContent: "flex-end" }}>
            <a href="#urun-akisi" style={{ fontSize: 12, color: C.mid, textDecoration: "none" }}>
              Ürün akışı
            </a>
            <a href="#sektorler" style={{ fontSize: 12, color: C.mid, textDecoration: "none" }}>
              Sektörler
            </a>
            <a href="#tanitim" style={{ fontSize: 12, color: C.mid, textDecoration: "none" }}>
              Tanıtım
            </a>
            <a href="#nasil-baslanir" style={{ fontSize: 12, color: C.mid, textDecoration: "none" }}>
              Nasıl çalışır
            </a>
            <a href="#ozellikler" style={{ fontSize: 12, color: C.mid, textDecoration: "none" }}>
              Özellikler
            </a>
            <a href="#fiyatlandirma" style={{ fontSize: 12, color: C.mid, textDecoration: "none" }}>
              Fiyat
            </a>
            <a href="#sss" style={{ fontSize: 12, color: C.mid, textDecoration: "none" }}>
              SSS
            </a>
            <a href="/sitemap.xml" style={{ fontSize: 12, color: C.mid, textDecoration: "none" }}>
              Sitemap
            </a>
          </nav>
          <div style={{ fontSize: 12, color: C.light }}>Her işletmenin defteri dijital olsun.</div>
        </div>
      </footer>
    </div>
  );
}

/* ── ONBOARDING: spaghetti path + nodes (5s auto-advance) ── */
const PATH_VB = { w: 900, h: 140 };

function OnboardingCarousel() {
  const n = ONBOARD_STEPS.length;
  const [activeIdx, setActiveIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nodePts = useMemo(() => {
    const { w, h } = PATH_VB;
    const padX = 44;
    const usable = w - padX * 2;
    return ONBOARD_STEPS.map((_, i) => {
      const t = n <= 1 ? 0.5 : i / (n - 1);
      const x = padX + t * usable;
      const y = h / 2 + 22 * Math.sin(t * Math.PI * 2.1 + 0.35) + (i % 3) * 2 - 2;
      return { x, y };
    });
  }, [n]);

  const pathD = useMemo(() => {
    if (nodePts.length === 0) return '';
    if (nodePts.length === 1) return `M ${nodePts[0].x} ${nodePts[0].y}`;
    let d = `M ${nodePts[0].x} ${nodePts[0].y}`;
    for (let i = 0; i < nodePts.length - 1; i++) {
      const p0 = nodePts[i];
      const p1 = nodePts[i + 1];
      const mx = (p0.x + p1.x) / 2;
      const my = (p0.y + p1.y) / 2 + (i % 2 === 0 ? 10 : -10);
      d += ` Q ${mx} ${my} ${p1.x} ${p1.y}`;
    }
    return d;
  }, [nodePts]);

  const schedule = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIdx((i) => (i + 1) % n);
    }, 5000);
  }, [n]);

  useEffect(() => {
    schedule();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [schedule]);

  const goTo = (i: number) => {
    setActiveIdx(i);
    schedule();
  };

  const step = ONBOARD_STEPS[activeIdx];

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto' }}>
      <div
        style={{
          borderRadius: 14,
          border: bd,
          background: C.card,
          padding: 'clamp(18px, 3.5vw, 30px)',
          overflow: 'hidden',
        }}
      >
        <svg
          viewBox={`0 0 ${PATH_VB.w} ${PATH_VB.h}`}
          role="img"
          aria-label="Kurulum adımları yol haritası"
          style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 200 }}
        >
          <defs>
            <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={C.border} stopOpacity={0.45} />
              <stop offset="100%" stopColor={C.light} stopOpacity={0.35} />
            </linearGradient>
          </defs>
          <path
            d={pathD}
            fill="none"
            stroke="url(#pathGrad)"
            strokeWidth={1.25}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            pathLength={1}
            d={pathD}
            fill="none"
            stroke={C.dark}
            strokeWidth={1.35}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={1}
            strokeDashoffset={1 - (activeIdx + 1) / n}
            style={{ transition: 'stroke-dashoffset 0.55s ease' }}
            vectorEffect="non-scaling-stroke"
            opacity={0.92}
          />
          {nodePts.map((pt, i) => {
            const on = i === activeIdx;
            const done = i < activeIdx;
            return (
              <g key={i}>
                {on && (
                  <circle cx={pt.x} cy={pt.y} r={14} fill={C.dark} opacity={0.08} style={{ transition: 'all .35s ease' }} />
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={on ? 7 : done ? 5 : 4.5}
                  fill={on ? C.dark : C.card}
                  stroke={done || on ? C.dark : C.border}
                  strokeWidth={on ? 2 : 1.25}
                  style={{ transition: 'all .35s ease', cursor: 'pointer' }}
                  onClick={() => goTo(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      goTo(i);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Adım ${i + 1}: ${ONBOARD_STEPS[i].title}`}
                  aria-current={on ? 'step' : undefined}
                />
                <text
                  x={pt.x}
                  y={pt.y + 4}
                  textAnchor="middle"
                  style={{
                    fontFamily: mono,
                    fontSize: on ? 10 : 9,
                    fontWeight: 700,
                    fill: on ? '#fff' : C.dark2,
                    pointerEvents: 'none',
                  }}
                >
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>

        <div
          aria-live="polite"
          style={{
            marginTop: 18,
            paddingTop: 18,
            borderTop: `1px solid ${C.border}`,
            animation: 'fadeIn .35s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: step.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                flexShrink: 0,
              }}
              aria-hidden
            >
              {step.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, fontFamily: mono, color: C.light, marginBottom: 4 }}>
                ADIM {activeIdx + 1} / {n}
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.dark, marginBottom: 6, letterSpacing: -0.3 }}>
                {step.title}
              </div>
              <p style={{ fontSize: 14, color: C.mid, lineHeight: 1.55, margin: 0 }}>{step.desc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── PRICING CARD ── */
function PricingCard({
  label,
  price,
  sub,
  desc,
  features,
  highlight,
  onAction,
}: {
  label: string;
  price: string;
  sub: string;
  desc: string;
  features: string[];
  highlight?: boolean;
  onAction: () => void;
}) {
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
function ContactModal({ onClose }: { onClose: () => void }) {
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
          <button
            type="button"
            onClick={() => {
              if (!ok) return;
              appendContactLead(name.trim(), phone.trim());
              setSent(true);
            }}
            className="cta"
            style={{ width: "100%", padding: 14, fontSize: 14, fontWeight: 700, borderRadius: 8, border: "none", background: ok ? C.dark : C.border, color: ok ? "#fff" : C.light, cursor: ok ? "pointer" : "not-allowed", transition: "all .2s" }}
          >
            Gönder
          </button>
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
function DemoPickerModal({ onClose }: { onClose: () => void }) {
  const linkBase = {
    display: 'block' as const,
    width: '100%',
    textDecoration: 'none' as const,
    color: 'inherit' as const,
    boxSizing: 'border-box' as const,
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(250,250,248,.92)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: "max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left))", animation: "fadeIn .15s ease", overflowY: "auto" }}>
      <div style={{ background: C.card, border: `2px solid ${C.dark}`, borderRadius: 14, padding: "clamp(18px, 4vw, 32px)", width: "100%", maxWidth: 480, maxHeight: "min(92dvh, 720px)", overflowY: "auto", WebkitOverflowScrolling: "touch", animation: "fadeUp .2s ease", position: "relative", margin: "auto 0" }}>
        <button type="button" onClick={onClose} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", fontSize: 22, color: C.light, cursor: "pointer", padding: 8, lineHeight: 1 }} aria-label="Kapat">×</button>
        <div style={{ fontSize: 10, color: C.light, letterSpacing: 1.5, fontFamily: mono, marginBottom: 8, paddingRight: 36 }}>DEMO SEÇ</div>
        <div style={{ fontSize: "clamp(18px, 4vw, 22px)", fontWeight: 700, color: C.dark, marginBottom: 4, lineHeight: 1.2 }}>Hangi planı denemek istersiniz?</div>
        <div style={{ fontSize: 13, color: C.mid, marginBottom: 20, lineHeight: 1.45 }}>Faz 1 şablonlarından biriyle başlayın — kağıt adisyon çizgisinde, demo verilerle dolu.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link to="/demo/onboarding/temel" className="sc" style={{ ...linkBase, padding: "16px 18px", borderRadius: 10, border: bd, background: C.bg, textAlign: "left", cursor: "pointer", transition: "all .15s" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 3 }}>Temel</div>
            <div style={{ fontSize: 12, color: C.mid, lineHeight: 1.4 }}>Operasyon, hizmetler, analitik — POS olmadan</div>
          </Link>
          <Link to="/demo/onboarding/pos" className="sc" style={{ ...linkBase, padding: "16px 18px", paddingTop: 22, borderRadius: 10, border: `2px solid ${C.dark}`, background: C.card, textAlign: "left", cursor: "pointer", transition: "all .15s", position: "relative" }}>
            <div style={{ position: "absolute", top: -1, right: 12, background: C.dark, color: "#fff", padding: "3px 10px", borderRadius: "0 0 5px 5px", fontSize: 9, fontWeight: 600 }}>+ POS</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 3 }}>Temel + POS</div>
            <div style={{ fontSize: 12, color: C.mid, lineHeight: 1.4 }}>Her şey dahil — POS cihaz yönetimi ve ödeme gönderme</div>
          </Link>
        </div>
      </div>
    </div>
  );
}