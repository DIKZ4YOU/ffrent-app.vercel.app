// Contoh komponen React — upload file ini untuk test!
const App = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      color: '#fff',
      fontFamily: 'sans-serif',
      gap: '24px',
    }}>
      <h1 style={{ fontSize: '3rem', margin: 0 }}>🚀 Halo dari JSX!</h1>
      <p style={{ color: '#aaa', fontSize: '1.1rem' }}>
        File ini diupload dan langsung jadi website 🎉
      </p>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        background: 'rgba(255,255,255,.05)',
        padding: '24px 40px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,.1)',
      }}>
        <button
          onClick={() => setCount(c => c - 1)}
          style={{ fontSize: '2rem', background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}
        >➖</button>
        <span style={{ fontSize: '3rem', fontWeight: 'bold', minWidth: '80px', textAlign: 'center' }}>
          {count}
        </span>
        <button
          onClick={() => setCount(c => c + 1)}
          style={{ fontSize: '2rem', background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}
        >➕</button>
      </div>
      <p style={{ color: '#555', fontSize: '.85rem', fontFamily: 'monospace' }}>
        Counter sederhana — ubah kodenya, upload ulang!
      </p>
    </div>
  );
};
