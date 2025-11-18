# 🔄 Migración a Nueva API de Gemini (@google/genai)

## ¿Por qué esta migración?

La librería anterior `@google/generative-ai` está **deprecated** (descontinuada) y dejará de recibir actualizaciones el **30 de noviembre de 2025**. La nueva librería oficial `@google/genai` ofrece:

- ✅ Acceso a los modelos más recientes (Gemini 2.5)
- ✅ Mejor rendimiento y estabilidad
- ✅ Nuevas características (Live API, Veo)
- ✅ Soporte activo y actualizaciones continuas
- ✅ **Rutas de API correctas y actualizadas**

## 🚨 PROBLEMAS SOLUCIONADOS

### **ERROR 1: Rutas de API Obsoletas**
```
Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
```

**Causas:**
1. La librería antigua usaba rutas obsoletas
2. El modelo `gemini-1.5-flash` ya no es la versión más reciente
3. Faltaba el archivo `.env` con la API key

### **ERROR 2: Módulo No Encontrado**
```
Error: Cannot find module '@google/generative-ai'
Require stack:
- backend/src/services/suno.service.ts
```

**Causa:** `suno.service.ts` todavía importaba la librería antigua.

### **ERROR 3: Variables de Entorno No Cargadas**
```
❌ ERROR: GEMINI_API_KEY no está configurada en .env
```

**Causa:** `dotenv.config()` se ejecutaba DESPUÉS de importar los servicios, por lo que `process.env.GEMINI_API_KEY` era `undefined` durante la inicialización.

## ✅ CAMBIOS REALIZADOS

### 1. **Actualización de Dependencias** (`backend/package.json`)
```diff
- "@google/generative-ai": "^0.21.0"
+ "@google/genai": "^1.0.0"
```

### 2. **Migración de Servicios**

#### `backend/src/services/gemini.service.ts`

**ANTES:**
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
this.textModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const result = await this.textModel.generateContent(prompt);
return result.response.text();
```

**DESPUÉS:**
```typescript
import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
this.model = 'gemini-2.5-flash'; // Modelo más reciente
const response = await ai.models.generateContent({
  model: this.model,
  contents: prompt
});
return response.text; // Acceso directo a .text (no .response.text())
```

#### `backend/src/services/suno.service.ts`

**ANTES:**
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
this.textModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
```

**DESPUÉS:**
```typescript
import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
this.model = 'gemini-2.5-flash'; // Modelo estable
```

### 3. **Carga Correcta de Variables de Entorno** (`backend/src/index.ts`)

**ANTES (❌ INCORRECTO):**
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tarotRoutes from './routes/tarot.routes';  // ❌ Servicios se inicializan aquí
import geminiRoutes from './routes/gemini.routes'; // ❌ Pero .env aún no se cargó
import musicRoutes from './routes/music.routes';   // ❌ process.env.GEMINI_API_KEY = undefined

dotenv.config(); // ❌ Demasiado tarde!
```

**DESPUÉS (✅ CORRECTO):**
```typescript
// ✅ dotenv.config() PRIMERO antes de cualquier otro import
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import tarotRoutes from './routes/tarot.routes';  // ✅ Ahora .env ya está cargado
import geminiRoutes from './routes/gemini.routes'; // ✅ process.env.GEMINI_API_KEY disponible
import musicRoutes from './routes/music.routes';   // ✅ Los servicios se inicializan correctamente
```

**Importancia:** Los servicios Gemini y Suno leen `process.env.GEMINI_API_KEY` durante su inicialización (en el import). Si `dotenv.config()` no se ejecuta primero, la variable será `undefined`.

### 4. **Archivo .env Creado**
Se creó el archivo `backend/.env` con la estructura correcta.

## 🔧 CONFIGURACIÓN NECESARIA

### **PASO 1: Obtener API Key de Gemini**

1. Ve a: **https://makersuite.google.com/app/apikey**
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Create API Key"**
4. Copia la clave generada

### **PASO 2: Configurar archivo .env**

Abre el archivo `backend/.env` y reemplaza `your_gemini_api_key_here` con tu clave real:

```env
PORT=3001
GEMINI_API_KEY=AIzaSy...tu_clave_real_aqui
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### **PASO 3: Instalar Dependencias**

```bash
cd backend
npm install
```

### **PASO 4: Iniciar el Backend**

```bash
npm run dev
```

Deberías ver:
```
✅ GeminiService inicializado con modelo: gemini-2.5-flash
🚀 Backend running on port 3001
```

## 🧪 PRUEBAS

### **Probar Generación de Lectura**

1. Inicia el backend: `cd backend && npm run dev`
2. Inicia el frontend: `cd frontend && npm run dev`
3. Abre el navegador en `http://localhost:5173`
4. Arrastra algunas cartas al tapete
5. Haz clic en **"Generar Lectura"**

Si ves la lectura generada, ¡todo funciona correctamente! 🎉

### **Verificar en Consola**

En la terminal del backend deberías ver logs como:
```
✅ GeminiService inicializado con modelo: gemini-2.5-flash
🎴 Drew 3 cards from tarot-marsella (23 available)
📖 Generating reading for 3 cards...
```

## ❌ SOLUCIÓN DE PROBLEMAS

### Error: "GEMINI_API_KEY no está configurada"
**Solución:** Edita `backend/.env` y agrega tu API key real.

### Error: "Failed to generate tarot reading"
**Posibles causas:**
1. API key inválida o expirada → Genera una nueva en Google AI Studio
2. Límite de requests alcanzado → Espera unos minutos
3. Sin conexión a Internet → Verifica tu conexión

### Error: "Cannot find module '@google/genai'"
**Solución:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

## 📚 RECURSOS

- **Documentación oficial:** https://ai.google.dev/gemini-api/docs
- **Repositorio de la librería:** https://github.com/googleapis/js-genai
- **Obtener API Key:** https://makersuite.google.com/app/apikey
- **Modelos disponibles:** https://ai.google.dev/gemini-api/docs/models

## 🎯 PRÓXIMOS PASOS

Una vez que tengas todo funcionando:

1. ✅ Verifica que las imágenes de cartas se generen con Pollinations.AI
2. ✅ Prueba el sistema anti-repetición de cartas
3. ✅ Prueba el botón "Nueva Tirada"
4. ✅ Verifica que los nombres de tarot aparezcan en cartas boca abajo

¡Todo debería funcionar perfectamente ahora con las rutas correctas de la API! 🌙✨
