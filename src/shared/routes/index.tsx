import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const LandingScreen = lazy(() => import('@/screens/landing/landing-screen'));
const DemoOnboardingScreen = lazy(() => import('@/screens/demo/onboarding/demo-onboarding.screen'));
const DemoAppScreen = lazy(() => import('@/screens/demo/app/demo-app.screen'));
const NotFoundScreen = lazy(() => import('@/screens/not-found/not-found.screen'));
const AdminScreen = lazy(() => import('@/screens/admin/admin.screen'));

function RouteFallback() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        color: '#888',
      }}
    >
      Yükleniyor…
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<LandingScreen />} />
        <Route path="/demo/onboarding/:mode" element={<DemoOnboardingScreen />} />
        <Route path="/demo/app/:mode" element={<DemoAppScreen />} />
        <Route path="/admin" element={<AdminScreen />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </Suspense>
  );
}
