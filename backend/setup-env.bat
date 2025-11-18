@echo off
echo.
echo 🔮 Super Tarot - Configuración Inicial
echo ======================================
echo.

REM Verificar si estamos en el directorio correcto
if not exist "package.json" (
    echo ❌ Error: Debes ejecutar este script desde la carpeta backend/
    pause
    exit /b 1
)

REM Verificar si ya existe .env
if exist ".env" (
    echo ⚠️  Ya existe un archivo .env
    choice /C SN /M "¿Deseas sobrescribirlo?"
    if errorlevel 2 (
        echo Cancelado.
        pause
        exit /b 0
    )
)

REM Crear archivo .env
echo 📝 Creando archivo .env...
copy /Y .env.example .env >nul

echo.
echo ✅ Archivo .env creado exitosamente!
echo.
echo ⚠️  IMPORTANTE: Ahora debes configurar tu API KEY de Gemini
echo.
echo Pasos:
echo 1. Ve a: https://makersuite.google.com/app/apikey
echo 2. Crea una API Key (es GRATIS)
echo 3. Edita el archivo .env y reemplaza 'your_gemini_api_key_here' con tu clave real
echo.
echo Ejemplo:
echo GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
echo.
echo 💡 Tip: Puedes editar .env con Notepad, VS Code, o cualquier editor
echo.

REM Preguntar si quiere abrir el archivo
choice /C SN /M "¿Quieres abrir el archivo .env para editarlo ahora?"
if errorlevel 2 goto :skip_edit

REM Intentar abrir con el editor predeterminado
start notepad .env

:skip_edit
echo.
echo 🚀 Una vez configurada la API key, ejecuta: npm run dev
echo.
pause
