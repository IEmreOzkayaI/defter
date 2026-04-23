import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

export function LandingContainer({ children, className = '' }: Props) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-12 ${className}`.trim()}>{children}</div>;
}
