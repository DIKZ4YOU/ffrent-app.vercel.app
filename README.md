# ⚡ JSX Live App

> Upload file `.jsx` → langsung jadi website yang bisa dibuka!

---

## 🚀 Cara Pakai

### 1. Install dependensi
```bash
npm install
```

### 2. Jalankan server
```bash
npm start
```

### 3. Buka browser
```
http://localhost:3000
```

### 4. Upload file JSX kamu!
Drag & drop atau klik tombol pilih file — website langsung terbuka otomatis di tab baru 🎉

---

## 📁 Struktur Project

```
jsx-live-app/
├── server.js              ← Server utama (Express + Multer)
├── package.json
├── contoh-komponen.jsx    ← Contoh file JSX untuk dicoba
└── public/
    ├── index.html         ← Halaman upload
    └── uploads/           ← File JSX yang diupload disimpan di sini
```

---

## ✅ Format Komponen yang Didukung

Komponen harus menggunakan salah satu nama berikut:

```jsx
const App = () => <div>...</div>       // ← paling umum
const Page = () => <div>...</div>
const Component = () => <div>...</div>
```

React, useState, useEffect, dll sudah tersedia — **tidak perlu import**!

```jsx
const App = () => {
  const [count, setCount] = React.useState(0);
  return <button onClick={() => setCount(c => c+1)}>Klik {count}</button>;
};
```

Tailwind CSS juga sudah tersedia:

```jsx
const App = () => (
  <div className="flex items-center justify-center h-screen bg-blue-500">
    <h1 className="text-4xl text-white font-bold">Halo Dunia!</h1>
  </div>
);
```

---

## 🔌 API Endpoints

| Method | URL | Keterangan |
|--------|-----|------------|
| `POST` | `/upload` | Upload file JSX |
| `GET` | `/preview/:filename` | Lihat hasil website |
| `GET` | `/api/files` | Daftar semua file |
| `DELETE` | `/api/files/:filename` | Hapus file |

---

## 📦 Teknologi

- **Node.js** + **Express** — Backend server
- **Multer** — File upload handler
- **Babel Standalone** — Compile JSX di browser (tidak perlu build step!)
- **React 18** — Render komponen
- **Tailwind CSS** — Styling siap pakai
