import './shared/styles/index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import AppLayout from '@/shared/layouts/app.layout';
import { LandingUserProvider } from '@/shared/context/landing-user.context';
import AppRoutes from '@/shared/routes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppLayout>
      <LandingUserProvider>
        <AppRoutes />
      </LandingUserProvider>
    </AppLayout>
  </StrictMode>
);
