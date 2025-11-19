# 🚀 Cómo Iniciar Super Tarot

## ⚠️ IMPORTANTE: Configurar API Key Primero

### 1. Obtener API Key de Gemini
1. Ve a: https://makersuite.google.com/app/apikey
2. Crea una API Key (es GRATIS)
3. Copia la clave

### 2. Configurar el Backend
```bash
cd backend

# Crear archivo .env (si no existe)
cp .env.example .env

# Editar .env y agregar tu API key:
# GEMINI_API_KEY=tu_clave_real_aqui
```

Tu archivo `backend/.env` debe verse así:
```env
PORT=3001
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX  # ← TU CLAVE REAL AQUÍ
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Opcional (solo si quieres generar audio)
SUNO_API_ENABLED=false
SUNO_API_KEY=your_suno_api_key_here
SUNO_API_URL=https://api.sunoapi.com/api/v1
```

---

## 🎯 Iniciar la Aplicación

### Terminal 1 - Backend (Puerto 3001)
```bash
cd backend
npm install    # Solo la primera vez
npm run dev
```

**Deberías ver:**
```
✅ Loaded 6 music styles
🔮 Tarot API server running on http://localhost:3001
📡 CORS enabled for: http://localhost:5173
```

### Terminal 2 - Frontend (Puerto 5173)
```bash
cd frontend
npm install    # Solo la primera vez
npm run dev
```

**Deberías ver:**
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🌐 Abrir la Aplicación

Una vez que ambos estén corriendo:

**Abre tu navegador en:** http://localhost:5173

---

## 🐛 Solución de Problemas

### Error: "Failed to fetch decks" / ECONNREFUSED
**Problema:** El backend no está corriendo
**Solución:** Inicia el backend en Terminal 1 (ver arriba)

### Error: "403 Forbidden" / "API Key"
**Problema:** No configuraste la API Key de Gemini
**Solución:**
1. Edita `backend/.env`
2. Agrega `GEMINI_API_KEY=tu_clave_real`
3. Reinicia el backend

### Error: "Port 3001 already in use"
**Problema:** Hay otro proceso usando el puerto
**Solución:**
- **Windows:** `netstat -ano | findstr :3001` luego `taskkill /PID xxxx /F`
- **Mac/Linux:** `lsof -ti:3001 | xargs kill -9`

### Error: "Module not found"
**Problema:** Faltan dependencias
**Solución:**
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

## 📦 Dependencias Necesarias

### Backend
```bash
cd backend
npm install
```

Instala:
- express
- typescript
- @google/generative-ai
- axios
- cors
- dotenv

### Frontend
```bash
cd frontend
npm install
```

Instala:
- react
- typescript
- vite
- react-dnd
- html2canvas
- jspdf
- tailwindcss

---

## ✅ Verificar que Todo Funciona

1. **Backend Health Check:**
   - Abre: http://localhost:3001/api/health
   - Debes ver: `{"status":"ok","message":"Tarot API is running"}`

2. **Verificar Mazos:**
   - Abre: http://localhost:3001/api/tarot/decks
   - Debes ver JSON con 4 mazos: Marsella, Ángeles, Diosas, Osho

3. **Frontend:**
   - Abre: http://localhost:5173
   - Debes ver la interfaz de Super Tarot
   - Selecciona un mazo
   - Saca una carta
   - Arrástrala al tapete

---

## 🎴 Mazos Disponibles

1. **Tarot de Marsella** - 22 Arcanos Mayores clásicos
2. **Tarot de los Ángeles** - 12 cartas angelicales
3. **Tarot de las Diosas** - 12 arquetipos femeninos
4. **Tarot Zen de Osho** - 23 cartas de consciencia espiritual

---

## 🎵 Sistema de Música (Opcional)

El sistema de generación de música está disponible en el backend:

**Endpoints:**
- `GET /api/music/styles` - Ver estilos musicales
- `POST /api/music/generate-lyrics` - Generar letras (solo Gemini)
- `POST /api/music/generate-song` - Canción completa (requiere Suno)

**Nota:** El frontend de música AÚN NO está implementado. Solo está el backend.

---

## 📚 Recursos Útiles

- **Documentación del Proyecto:** Ver `README.md`
- **Tareas Pendientes:** Ver `TASKS.md`
- **API Gemini:** https://ai.google.dev/
- **Vite Docs:** https://vitejs.dev/
- **React DnD:** https://react-dnd.github.io/react-dnd/

---

## 🆘 ¿Aún Tienes Problemas?

1. Asegúrate de tener **Node.js 18+** instalado: `node --version`
2. Verifica que **ambas terminales** están corriendo simultáneamente
3. Revisa los **logs de la consola** en ambas terminales
4. Abre **DevTools del navegador** (F12) y mira la pestaña Console
5. Verifica que el archivo `backend/.env` **existe y tiene la API KEY**

---

**¡Listo! Ahora deberías poder usar Super Tarot! 🌙✨**
