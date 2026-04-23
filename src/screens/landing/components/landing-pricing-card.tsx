type Props = {
  label: string;
  /** Rakam yerine iletişim odaklı başlık (ör. «Teklif alın») */
  priceTitle: string;
  /** Kısa açıklama — fiyatın iletişimle verileceğini netleştirir */
  priceSubtitle?: string;
  desc: string;
  features: string[];
  highlight?: boolean;
  onAction: () => void;
  /** CTA metni */
  actionLabel?: string;
};

export function LandingPricingCard({
  label,
  priceTitle,
  priceSubtitle,
  desc,
  features,
  highlight,
  onAction,
  actionLabel = 'İletişime geç',
}: Props) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-stone-900/[0.06] sm:p-8 ${
        highlight ? 'border-2 border-stone-900 ring-1 ring-stone-900/10' : 'border border-stone-200/90'
      }`}
    >
      {highlight ? (
        <span className="absolute -top-px right-6 rounded-b-md bg-stone-900 px-3 py-1 text-[9px] font-bold uppercase tracking-wide text-white">
          Popüler
        </span>
      ) : null}
      <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">{label}</p>
      <div className="rounded-xl border border-dashed border-stone-300/90 bg-stone-50/90 px-4 py-5">
        <p className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">{priceTitle}</p>
        {priceSubtitle ? <p className="mt-2 text-sm leading-relaxed text-stone-600">{priceSubtitle}</p> : null}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-stone-600">{desc}</p>
      <ul className="mt-6 flex flex-1 flex-col gap-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-stone-800">
            <span className="mt-0.5 font-bold text-emerald-600">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onAction}
        className={`mt-8 w-full rounded-xl py-3.5 text-sm font-semibold transition ${
          highlight ? 'bg-stone-900 text-white hover:bg-stone-800' : 'bg-stone-100 text-stone-900 hover:bg-stone-200'
        }`}
      >
        {actionLabel}
      </button>
    </div>
  );
}
