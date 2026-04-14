import { Link } from 'react-router-dom';

export default function NotFoundScreen() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        padding: 24,
      }}
    >
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Sayfa bulunamadı</h1>
      <p style={{ color: '#666', marginBottom: 20 }}>Aradığınız adres geçerli değil.</p>
      <Link to="/" style={{ color: '#111', fontWeight: 600 }}>
        Ana sayfaya dön
      </Link>
    </div>
  );
}
