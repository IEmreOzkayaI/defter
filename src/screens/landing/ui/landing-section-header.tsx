import type { ReactNode } from 'react';

type Props = {
  kicker: string;
  title: ReactNode;
  description?: string;
  className?: string;
};

export function LandingSectionHeader({ kicker, title, description, className = '' }: Props) {
  return (
    <div className={`mb-10 max-w-2xl ${className}`.trim()}>
      <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-400">{kicker}</p>
      <h2 className="text-balance text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-[2.35rem] lg:leading-[1.12]">
        {title}
      </h2>
      {description ? <p className="mt-4 text-pretty text-base leading-relaxed text-stone-600 sm:text-[15px]">{description}</p> : null}
    </div>
  );
}
