const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = 3000;

// ── Storage config ──────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'public/uploads')),
  filename:    (req, file, cb) => {
    const name = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, name);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ok = /\.(jsx|js|tsx|ts)$/i.test(file.originalname);
    if (!ok) return cb(new Error('Hanya file .jsx / .js / .tsx / .ts yang diizinkan!'));
    cb(null, true);
  },
});

// ── Static files ─────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── Upload endpoint ───────────────────────────────────────────────
app.post('/upload', upload.single('jsxfile'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Tidak ada file yang dikirim.' });
  res.json({ filename: req.file.filename, url: `/preview/${req.file.filename}` });
});

// ── Preview page ──────────────────────────────────────────────────
app.get('/preview/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'public/uploads', req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).send('File tidak ditemukan.');

  const jsxCode = fs.readFileSync(filePath, 'utf-8');

  res.send(`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview: ${req.params.filename}</title>

  <!-- React & ReactDOM -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>

  <!-- Babel Standalone (compile JSX di browser) -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <!-- Tailwind CSS (siap pakai di dalam komponen) -->
  <script src="https://cdn.tailwindcss.com"></script>

  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: sans-serif; }

    #__error {
      display: none;
      background: #ff4444;
      color: #fff;
      padding: 16px 20px;
      font-family: monospace;
      white-space: pre-wrap;
      position: fixed;
      bottom: 0; left: 0; right: 0;
      max-height: 40vh;
      overflow: auto;
      z-index: 9999;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <div id="__error"></div>

  <script type="text/babel" data-presets="react,env">
    // ─── Kode JSX yang diupload ───────────────────────────────────
    ${jsxCode}
    // ─────────────────────────────────────────────────────────────

    // Coba render export default
    try {
      const rootEl = document.getElementById('root');
      const root   = ReactDOM.createRoot(rootEl);

      // Cek apakah ada export default
      // Karena kita inject langsung, komponen harus bernama "App" atau export default
      // Kita coba nama umum: App, default
      const Component =
        typeof App !== 'undefined'      ? App :
        typeof Default !== 'undefined'  ? Default :
        typeof Page !== 'undefined'     ? Page :
        typeof Component !== 'undefined'? Component :
        (() => React.createElement('div', {
          style: { padding: 32, fontFamily: 'monospace', color: '#555' }
        }, '⚠️  Tidak ada komponen bernama App / Page / Component. Pastikan ada: const App = () => <div>…</div>'))();

      root.render(React.createElement(Component));
    } catch (err) {
      const el = document.getElementById('__error');
      el.style.display = 'block';
      el.textContent = '❌ Error: ' + err.message;
    }
  </script>
</body>
</html>`);
});

// ── Daftar file yang sudah diupload ──────────────────────────────
app.get('/api/files', (req, res) => {
  const dir = path.join(__dirname, 'public/uploads');
  const files = fs.readdirSync(dir)
    .filter(f => /\.(jsx|js|tsx|ts)$/i.test(f))
    .map(f => ({ filename: f, url: `/preview/${f}` }));
  res.json(files);
});

// ── Delete file ───────────────────────────────────────────────────
app.delete('/api/files/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'public/uploads', req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File tidak ada.' });
  fs.unlinkSync(filePath);
  res.json({ success: true });
});

// ── Start server ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  JSX Live App berjalan di → http://localhost:${PORT}\n`);
});
