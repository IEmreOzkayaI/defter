import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

import queryClient from '@/shared/providers/query-client.provider';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
