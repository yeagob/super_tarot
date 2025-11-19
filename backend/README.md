# Backend - Super Tarot API

API REST para la aplicación de lecturas de tarot con inteligencia artificial, construida con Express, TypeScript y Gemini AI.

## 🚀 Inicio Rápido

### 1. Instalación

```bash
npm install
```

**Nota**: El script `postinstall` ejecuta automáticamente `npm run build` después de instalar las dependencias, generando la carpeta `dist/` con el código compilado y los archivos de datos.

### 2. Configuración

Copia el archivo de ejemplo y configura tus variables de entorno:

```bash
cp .env.example .env
```

Edita `.env` y configura tu API key de Gemini:

```env
GEMINI_API_KEY=tu_clave_aqui
PORT=3001
```

Obtén tu API key gratis en: https://makersuite.google.com/app/apikey

### 3. Ejecutar

**Desarrollo** (con hot-reload):
```bash
npm run dev
```

**Producción** (build + start):
```bash
npm run start:prod
```

**Solo ejecutar** (requiere build previo):
```bash
npm start
```

## 📦 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor en modo desarrollo con hot-reload |
| `npm run build` | Compila TypeScript y copia archivos de datos a `dist/` |
| `npm run copy:data` | Copia archivos JSON de datos a `dist/data/` |
| `npm start` | Ejecuta el servidor desde `dist/index.js` |
| `npm run start:prod` | **Build completo + start** (recomendado para producción) |

## 🏗️ Proceso de Build

El comando `npm run build` realiza dos operaciones:

1. **Compilación TypeScript**: `tsc` compila todos los archivos `.ts` de `src/` a JavaScript en `dist/`
2. **Copia de datos**: `copyfiles` copia todos los archivos JSON de `src/data/` a `dist/data/`

### ¿Por qué se copian los datos?

TypeScript solo compila archivos `.ts`, no copia archivos JSON. El backend necesita los archivos de datos (mazos, spreads, estilos de música) en `dist/data/` para funcionar correctamente en producción.

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/     # Controladores de API
│   ├── routes/          # Definición de rutas Express
│   ├── services/        # Servicios (Gemini, Suno)
│   ├── types/           # Tipos TypeScript
│   ├── data/            # Archivos JSON de datos
│   │   ├── tarot-*.json       # Mazos de tarot
│   │   ├── spreads.json       # Tiradas
│   │   └── music-styles.json  # Estilos musicales
│   └── index.ts         # Punto de entrada
├── dist/                # Código compilado (generado)
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── data/            # ← Datos copiados aquí
│   └── index.js
├── .env.example         # Ejemplo de variables de entorno
├── package.json
└── tsconfig.json        # Configuración de TypeScript
```

## 🌐 Endpoints de la API

### Tarot
- `GET /api/tarot/decks` - Lista todos los mazos
- `GET /api/tarot/decks/:deckId` - Obtiene un mazo específico
- `POST /api/tarot/decks/:deckId/shuffle` - Baraja cartas
- `GET /api/tarot/spreads` - Lista todas las tiradas

### Gemini AI
- `POST /api/gemini/reading` - Genera interpretación de tirada
- `POST /api/gemini/analyze-photo` - Analiza foto de cartas
- `GET /api/gemini/card-placeholder/:deckId/:cardId` - Placeholder de carta

### Editor (CRUD de mazos)
- `GET /api/editor/decks` - Lista mazos editables
- `POST /api/editor/decks` - Crea nuevo mazo
- `PUT /api/editor/decks/:id` - Actualiza mazo
- `DELETE /api/editor/decks/:id` - Elimina mazo
- `POST /api/editor/decks/:id/duplicate` - Duplica mazo
- `POST /api/editor/decks/:id/cards` - Añade carta
- `PUT /api/editor/decks/:id/cards/:cardId` - Actualiza carta
- `DELETE /api/editor/decks/:id/cards/:cardId` - Elimina carta

## 🔧 Despliegue en Producción

### Opción 1: Render, Railway, Fly.io

1. Conecta tu repositorio Git
2. Configura las variables de entorno:
   ```
   GEMINI_API_KEY=tu_clave
   PORT=3001
   ```
3. El comando de inicio debe ser: `npm run start:prod`
4. El script `postinstall` se ejecutará automáticamente después de `npm install`

### Opción 2: VPS/Servidor propio

```bash
# Clonar repositorio
git clone <tu-repo>
cd backend

# Instalar dependencias (ejecuta postinstall automáticamente)
npm install

# Configurar .env
cp .env.example .env
nano .env  # Editar y guardar

# Iniciar con PM2 (recomendado)
npm install -g pm2
pm2 start dist/index.js --name "tarot-api"
pm2 save
pm2 startup
```

## 🔍 Verificación del Build

Para verificar que el build se completó correctamente:

```bash
npm run build
ls -la dist/data  # Deberías ver todos los archivos JSON
npm start         # El servidor debería iniciar sin errores
```

Salida esperada:
```
✅ Loaded deck: Tarot de Marsella (22 cards)
✅ Loaded deck: Tarot de los Ángeles (12 cards)
✅ Loaded deck: Tarot de las Diosas (12 cards)
✅ Loaded deck: Tarot Zen de Osho (79 cards)
✅ Loaded 2 spreads
✅ GeminiService inicializado con modelo: gemini-2.5-flash
✅ Loaded 6 music styles
🔮 Tarot API server running on http://localhost:3001
```

## 📝 Notas Importantes

- **Siempre usa `npm run start:prod`** en producción para asegurar que el build está actualizado
- El script `postinstall` garantiza que después de `npm install` siempre haya una build lista
- Si modificas archivos JSON en `src/data/`, debes ejecutar `npm run build` para copiarlos a `dist/`
- Los archivos compilados en `dist/` están incluidos en `.gitignore` (se generan automáticamente)

## 🐛 Solución de Problemas

### Error: "Cannot find module './data/...'"

**Causa**: Los archivos de datos no están en `dist/data/`

**Solución**:
```bash
npm run build  # Esto compilará y copiará los datos
```

### El servidor no inicia correctamente

1. Verifica que el build se haya completado: `ls -la dist/`
2. Verifica que los datos estén copiados: `ls -la dist/data/`
3. Ejecuta: `npm run start:prod` para hacer build + start limpio
