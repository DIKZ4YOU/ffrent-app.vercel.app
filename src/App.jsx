import React, { useState, useEffect } from 'react';
import Member from './Member';
import Admin from './Admin';

// ─────────────────────────────────────────
// ROUTER SEDERHANA
// Akses /admin → Panel Admin
// Akses /       → Aplikasi Member
// ─────────────────────────────────────────

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  // Kalau URL mengandung /admin → tampilkan admin panel
  if (path.startsWith('/admin')) {
    return <Admin />;
  }

  return <Member />;
}
