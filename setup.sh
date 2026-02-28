#!/bin/bash

echo "============================================"
echo "   FF Rent - Auto Setup (Linux/Mac)"
echo "============================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[!] Node.js belum terinstall. Menginstall otomatis..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "[OK] Node.js: $(node --version)"
echo ""

echo "[*] Menginstall dependencies..."
npm install
echo ""

echo "[*] Menjalankan aplikasi..."
npm start
