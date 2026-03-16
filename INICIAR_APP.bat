@echo off
setlocal enabledelayedexpansion

echo ==================================================
echo   🚀 INICIANDO TARIFA FREELANCE ZEN
echo ==================================================
echo.
echo 1. Instalando dependencias (si faltan)...
call npm.cmd install --legacy-peer-deps

echo 2. Iniciando servidor de desarrollo...
echo.
echo [!] La aplicacion se abrira automaticamente en tu navegador.
echo.

:: Inicia vite en segundo plano y abre el navegador
start http://localhost:5173
call npm.cmd run dev

pause
