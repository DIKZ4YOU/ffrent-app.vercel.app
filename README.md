# 🎮 FF Rent — Panduan Deploy

Platform sewa akun Free Fire dengan panel admin terpisah.

---

## 🌐 URL Akses
- **Member App**: `https://domainmu.com/`
- **Admin Panel**: `https://domainmu.com/admin`

---

## 🚀 CARA 1: Deploy ke Vercel (GRATIS — Paling Mudah)

### Langkah 1 — Install Node.js
Download & install dari: https://nodejs.org (pilih versi LTS)

### Langkah 2 — Extract & Masuk Folder
```bash
cd ffrent-project
```

### Langkah 3 — Install Dependencies
```bash
npm install
```
Tunggu beberapa menit sampai selesai.

### Langkah 4 — Test di Lokal (Opsional)
```bash
npm start
```
Buka browser ke http://localhost:3000

### Langkah 5 — Deploy ke Vercel
```bash
npm install -g vercel
vercel
```
Ikuti instruksi:
- Set up and deploy? → **Y**
- Which scope? → pilih akun kamu
- Link to existing project? → **N**
- Project name → **ffrent-app** (atau terserah)
- In which directory is your code? → **.** (titik, artinya folder ini)
- Override settings? → **N**

Selesai! Dapat URL seperti: `https://ffrent-app.vercel.app` ✅

---

## 🌊 CARA 2: Deploy ke Netlify (GRATIS)

### Langkah 1-3 sama seperti di atas

### Langkah 4 — Build
```bash
npm run build
```
Akan muncul folder `/build`

### Langkah 5 — Upload ke Netlify
1. Buka https://netlify.com dan daftar/login
2. Klik **"Add new site"** → **"Deploy manually"**
3. Drag & drop folder **`build`** ke kolom yang disediakan
4. Selesai! URL seperti: `https://ffrent-app.netlify.app` ✅

---

## 🖥️ CARA 3: Shared Hosting / VPS (Domain Sendiri)

### Langkah 1-4 sama seperti Netlify (npm install → npm run build)

### Langkah 5 — Upload via cPanel / FileZilla
1. Login ke cPanel hosting kamu
2. Buka **File Manager** → masuk ke folder `public_html`
3. Upload **seluruh isi folder `build`** (bukan folder build-nya, tapi isinya)
4. Selesai! Akses via domain kamu

### Untuk VPS (Nginx)
Edit config Nginx `/etc/nginx/sites-available/ffrent`:
```nginx
server {
    listen 80;
    server_name domainmu.com www.domainmu.com;
    root /var/www/ffrent/build;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```

---

## 📁 Struktur Project

```
ffrent-project/
├── public/
│   ├── index.html       ← Template HTML utama
│   └── _redirects       ← Routing Netlify
├── src/
│   ├── index.jsx        ← Entry point React
│   ├── App.jsx          ← Router (/ = Member, /admin = Admin)
│   ├── Member.jsx       ← Aplikasi member
│   └── Admin.jsx        ← Panel admin
├── package.json
├── vercel.json          ← Config routing Vercel
└── .env                 ← Config build
```

---

## ⚙️ Konfigurasi Penting

### Ubah Info Kontak Admin
Buka `src/Member.jsx`, cari `const ADMIN_CONTACT`, ganti dengan nomor/email kamu:
```js
const ADMIN_CONTACT = {
  wa:      "628xxxxxxxxxxxx",   // nomor WA dengan kode negara, tanpa +
  waText:  "08xx-xxxx-xxxx",
  email:   "admin@emailkamu.com",
  ...
}
```

### Ubah Password Admin
Buka `src/Admin.jsx`, cari:
```js
if(lf.u==="admin"&&lf.p==="admin123")
```
Ganti `admin` dan `admin123` dengan username & password yang kamu mau.

---

## ❓ Troubleshooting

**Error saat `npm install`**
→ Pastikan Node.js sudah terinstall, cek dengan `node --version`

**Halaman /admin tidak muncul**
→ Pastikan `vercel.json` atau `_redirects` ada di project
→ Di Netlify, pastikan file `public/_redirects` ter-upload

**Layar putih / blank**
→ Buka DevTools (F12) → Console → cek error
→ Pastikan semua file src/ ada (Member.jsx, Admin.jsx, App.jsx, index.jsx)

---

## 💡 Tips

- Untuk **domain custom** (misal `ffrent.id`), beli di Namecheap/Niagahoster, lalu sambungkan ke Vercel/Netlify secara gratis
- Vercel & Netlify keduanya support **HTTPS otomatis** (SSL gratis)
- Data tersimpan di **browser storage** masing-masing pengguna, bukan database server

---

Dibuat dengan ❤️ — FF Rent Platform v2.0
