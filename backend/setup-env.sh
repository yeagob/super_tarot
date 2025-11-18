#!/bin/bash

echo "🔮 Super Tarot - Configuración Inicial"
echo "======================================"
echo ""

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Debes ejecutar este script desde la carpeta backend/"
    exit 1
fi

# Verificar si ya existe .env
if [ -f ".env" ]; then
    echo "⚠️  Ya existe un archivo .env"
    read -p "¿Deseas sobrescribirlo? (s/N): " overwrite
    if [ "$overwrite" != "s" ] && [ "$overwrite" != "S" ]; then
        echo "Cancelado."
        exit 0
    fi
fi

# Crear archivo .env
echo "📝 Creando archivo .env..."
cp .env.example .env

echo ""
echo "✅ Archivo .env creado exitosamente!"
echo ""
echo "⚠️  IMPORTANTE: Ahora debes configurar tu API KEY de Gemini"
echo ""
echo "Pasos:"
echo "1. Ve a: https://makersuite.google.com/app/apikey"
echo "2. Crea una API Key (es GRATIS)"
echo "3. Edita el archivo .env y reemplaza 'your_gemini_api_key_here' con tu clave real"
echo ""
echo "Ejemplo:"
echo "GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX"
echo ""
echo "💡 Tip: Puedes editar .env con cualquier editor de texto"
echo ""

# Preguntar si quiere abrir el archivo para editarlo
if command -v nano &> /dev/null; then
    read -p "¿Quieres editar el archivo .env ahora? (s/N): " edit_now
    if [ "$edit_now" = "s" ] || [ "$edit_now" = "S" ]; then
        nano .env
    fi
elif command -v vim &> /dev/null; then
    read -p "¿Quieres editar el archivo .env ahora? (s/N): " edit_now
    if [ "$edit_now" = "s" ] || [ "$edit_now" = "S" ]; then
        vim .env
    fi
fi

echo ""
echo "🚀 Una vez configurada la API key, ejecuta: npm run dev"
echo ""
