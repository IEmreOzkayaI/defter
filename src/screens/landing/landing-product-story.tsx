import { C, bd, mono, sans } from '@/shared/constants/demo.constants';

const steps = [
  {
    k: '01',
    t: 'Kağıdı ekrana taşı',
    d: 'Masa, kabin, PC veya masa — bugün fişe ne yazıyorsanız aynı kalemi dijital adisyonda toplayın.',
    i: '▤',
  },
  {
    k: '02',
    t: 'Açık işlemi görün',
    d: 'Hangi kayıt açık, hangisi tahsilatta; tek listeden takip. “Bu hesap kapandı mı?” sorusu netleşir.',
    i: '◎',
  },
  {
    k: '03',
    t: 'Kapat',
    d: 'Tahsilatla kapatın; PlayStation ve internet kafede dilimli süre veya sabit paket uyarıları şablonda.',
    i: '◫',
  },
];

export function LandingProductStory() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
      {steps.map((step) => (
        <article
          key={step.k}
          className="sc"
          style={{
            padding: 22,
            borderRadius: 12,
            border: bd,
            background: C.card,
            transition: 'all .25s',
            fontFamily: sans,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontFamily: mono, letterSpacing: 1.2, color: C.light }}>{step.k}</span>
            <span style={{ fontSize: 22, lineHeight: 1 }} aria-hidden>
              {step.i}
            </span>
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: C.dark, marginBottom: 8, letterSpacing: -0.3 }}>{step.t}</h3>
          <p style={{ fontSize: 14, color: C.mid, lineHeight: 1.55, margin: 0 }}>{step.d}</p>
        </article>
      ))}
    </div>
  );
}
