const steps = [
  {
    k: '01',
    t: 'Oturumu aç',
    d: 'Hazır kabin/anahtar listesinden veya yeni ad ile oturum başlatın; demo akışının ilk adımı.',
    i: '⌂',
  },
  {
    k: '02',
    t: 'Sepete hizmet ekle',
    d: 'Kese, köpük, sauna, masaj ve kafeterya kalemlerini sepet mantığıyla ekleyin; miktar ve toplam anında.',
    i: '▤',
  },
  {
    k: '03',
    t: 'Süreyi izle',
    d: 'Seans süresi veya dilim; paket seçtiyseniz sabit süre dolunca uyarı (demo mantığı).',
    i: '⏱',
  },
  {
    k: '04',
    t: 'Tahsilat (+ isteğe bağlı POS)',
    d: 'Kapanışta tahsilat; POS demosunda cihaz seçip gönderim simülasyonu.',
    i: '◫',
  },
  {
    k: '05',
    t: 'Güne bak',
    d: 'Analiz sekmesinde kapalı ciro, açık tahmini ve en çok satan kalemler — gün sonu özeti.',
    i: '◩',
  },
];

export function LandingProductStory() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {steps.map((step) => (
        <article
          key={step.k}
          className="group flex flex-col rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-lg hover:shadow-stone-900/[0.06]"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">{step.k}</span>
            <span className="text-xl leading-none text-stone-800 transition group-hover:scale-105" aria-hidden>
              {step.i}
            </span>
          </div>
          <h3 className="text-[17px] font-semibold tracking-tight text-stone-900">{step.t}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">{step.d}</p>
        </article>
      ))}
    </div>
  );
}
