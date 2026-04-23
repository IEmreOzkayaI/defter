import { FAQ_LANDING_ITEMS } from '@/shared/seo/faq-landing.data';
import { LandingContainer } from '@/screens/landing/ui/landing-container';

export function FaqSection() {
  return (
    <section id="sss" aria-labelledby="sss-heading" className="bg-white py-16 sm:py-20 lg:py-24">
      <LandingContainer className="max-w-3xl">
        <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-400">SSS</p>
        <h2 id="sss-heading" className="text-balance text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Sıkça sorulan sorular
        </h2>
        <div className="mt-10 flex flex-col gap-4">
          {FAQ_LANDING_ITEMS.map((item, i) => (
            <article
              key={i}
              className="rounded-2xl border border-stone-200/80 bg-[#fafaf9] p-5 transition hover:border-stone-300 hover:bg-white hover:shadow-md sm:p-6"
            >
              <h3 className="text-base font-semibold text-stone-900">{item.question}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">{item.answer}</p>
            </article>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}
