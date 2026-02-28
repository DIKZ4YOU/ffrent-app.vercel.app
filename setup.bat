@echo off
echo ============================================
echo    FF Rent - Auto Setup (Windows)
echo ============================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [!] Node.js belum terinstall.
    echo [*] Membuka halaman download Node.js...
    start https://nodejs.org/en/download
    echo.
    echo Setelah install Node.js, jalankan setup.bat ini lagi.
    pause
    exit
)

echo [OK] Node.js ditemukan:
node --version
echo.

echo [*] Menginstall dependencies...
npm install
echo.

echo [*] Menjalankan aplikasi...
npm start
