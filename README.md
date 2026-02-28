# 🎮 FF Rent - Platform Sewa Akun Free Fire

Platform sewa akun Free Fire terpercaya dengan sistem koin, referral, dan panel admin.

---

## 🚀 Cara Jalankan (Lokal)

### Windows
```
Klik 2x file: setup.bat
```

### Linux / Mac
```bash
chmod +x setup.sh
./setup.sh
```

### Manual
```bash
npm install
npm start
```

---

## 🌐 Deploy ke GitHub Pages

1. Push ke branch `main` atau `master`
2. GitHub Actions akan otomatis build & deploy
3. Aktifkan **GitHub Pages** di Settings → Pages → Source: `gh-pages` branch

---

## 🔗 Akses Panel Admin

Buka di browser: `http://localhost:3000/admin`

---

## 📁 Struktur Project

```
ffrent-app/
├── src/
│   ├── App.jsx       → Router utama
│   ├── Member.jsx    → Halaman member
│   ├── Admin.jsx     → Panel admin
│   └── index.jsx     → Entry point
├── public/
│   └── index.html
├── .github/
│   └── workflows/
│       └── deploy.yml  → Auto deploy GitHub Pages
├── setup.bat           → Auto install Windows
├── setup.sh            → Auto install Linux/Mac
└── package.json
```

---

## ⚙️ Tech Stack

- **React 18** - UI Framework
- **Create React App** - Build tool
- **LocalStorage** - Penyimpanan data lokal
- **GitHub Actions** - CI/CD auto deploy
