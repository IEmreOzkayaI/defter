const modules = [
  {
    k: '01',
    t: 'Kabin / anahtar oturumu',
    d: 'Resepsiyonda hızlı açılış: hangi kabin dolu, hangi anahtar sahada netleşir.',
    i: '⌂',
  },
  {
    k: '02',
    t: 'Hamam · sauna · masaj kalemleri',
    d: 'Kese, köpük, fin sauna, buhar ve masaj gibi hizmetleri sepet mantığında ekleyin; ekstra satışlar kaybolmaz.',
    i: '▤',
  },
  {
    k: '03',
    t: 'Süre ve paket kontrolü',
    d: 'Seans süresi ve paketler için uyarı yaklaşımı; yoğun günde “eksik ücret / eksik süre” riskini azaltır.',
    i: '⏱',
  },
  {
    k: '04',
    t: 'Tahsilat + (isteğe bağlı) POS',
    d: 'Kapanışta tahsilat akışı; POS modülünde cihaz seçimi ve gönderim (demo).',
    i: '⬡',
  },
  {
    k: '05',
    t: 'Gün sonu analizi',
    d: 'Kapalı ciro, açık tahmini ve en çok satan kalemler — tek sekmede özet.',
    i: '◩',
  },
] as const;

export function LandingSpaModules() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {modules.map((m) => (
        <div
          key={m.k}
          className="group rounded-2xl border border-stone-200/80 bg-[#fafaf9] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-stone-300 hover:bg-white hover:shadow-md"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400">{m.k}</span>
            <span className="text-lg leading-none text-stone-800" aria-hidden>
              {m.i}
            </span>
          </div>
          <div className="text-[15px] font-semibold tracking-tight text-stone-900">{m.t}</div>
          <div className="mt-2 text-[13px] leading-relaxed text-stone-600">{m.d}</div>
        </div>
      ))}
    </div>
  );
}
