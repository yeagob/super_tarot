# 🌙 Super Tarot 🌙

Una aplicación web completa de lectura de Tarot con **drag & drop**, **interpretaciones con IA** y **generación de imágenes**. Desarrollada con React, TypeScript, Node.js y Gemini AI.

## ✨ Características

### 🎴 Sistema de Cartas
- **4 mazos de Tarot** incluidos:
  - Tarot de Marsella (22 Arcanos Mayores)
  - Tarot de los Ángeles (12 cartas)
  - Tarot de las Diosas (12 cartas)
  - Tarot de 8 (8 cartas)
- Sistema extensible para agregar más mazos

### 🎯 Funcionalidades Principales
- **Drag & Drop**: Arrastra cartas desde el mazo al tapete
- **Tiradas Predefinidas**: Tiradas de 4 y 8 cartas con posiciones sugeridas
- **Snap to Position**: Las cartas se ajustan automáticamente a las posiciones sugeridas
- **Cartas Invertidas**: Opción para permitir cartas en posición invertida
- **Revelar Cartas**: Haz clic en una carta para revelarla
- **Voltear Cartas**: Cambia la orientación de una carta revelada
- **Tooltips Informativos**: Información detallada al pasar el mouse sobre las cartas
- **Lectura con IA**: Interpretación profunda de la tirada usando Gemini AI con 10 secciones estructuradas
- **Generación de Canciones**: Crea canciones personalizadas basadas en tu lectura de tarot
- **Exportar Lectura**: Descarga tu lectura en PDF, envíala por Email o compártela por WhatsApp
- **Exportar Tirada**: Descarga una imagen de tu tirada completa
- **Descargar Cartas**: Descarga cartas individuales

### 🎵 Sistema de Generación de Canciones
- **Letras con IA**: Genera letras profesionales con Gemini AI basadas en tu lectura
- **6 Estilos Musicales**:
  - Balada Pop Cinematográfica
  - Pop Latino Moderno
  - Americana/Alt-Country
  - Lo-Fi Bedroom Pop
  - Canción de Antorcha de Piano
  - Gospel-Soul
- **Integración Suno AI** (opcional): Genera audio/video completo de la canción
- **Letras Estructuradas**: Verso 1, Coro, Verso 2, Puente, Coro Final
- **Producción Profesional**: Prompts detallados con especificaciones de BPM, tonalidad, instrumentación

### 🎨 Diseño
- Interfaz oscura con temática mística
- Animaciones fluidas y efectos visuales
- Diseño responsivo para desktop y móvil
- Gradientes dorados y púrpuras

## 🏗️ Arquitectura

### Backend (Node.js + Express + TypeScript)
```
backend/
├── src/
│   ├── controllers/     # Lógica de negocio
│   │   ├── tarot.controller.ts
│   │   ├── gemini.controller.ts
│   │   └── music.controller.ts
│   ├── data/           # Archivos JSON con datos
│   │   ├── tarot-marsella.json
│   │   ├── tarot-angeles.json
│   │   ├── tarot-diosas.json
│   │   ├── tarot-8.json
│   │   ├── spreads.json
│   │   └── music-styles.json
│   ├── routes/         # Definición de rutas de la API
│   │   ├── tarot.routes.ts
│   │   ├── gemini.routes.ts
│   │   └── music.routes.ts
│   ├── services/       # Servicios de IA y externos
│   │   ├── gemini.service.ts
│   │   └── suno.service.ts
│   ├── types/          # Tipos TypeScript
│   └── index.ts        # Punto de entrada
```

### Frontend (React + TypeScript + Vite)
```
frontend/
├── src/
│   ├── components/     # Componentes React
│   ├── hooks/          # Custom hooks
│   ├── services/       # Llamadas a la API
│   ├── styles/         # Estilos CSS
│   ├── types/          # Tipos TypeScript
│   ├── App.tsx         # Componente principal
│   └── main.tsx        # Punto de entrada
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ y npm
- Clave API de Google Gemini (obtén una en [Google AI Studio](https://makersuite.google.com/app/apikey))

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd super_tarot
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en la carpeta `backend/`:
```env
PORT=3001
GEMINI_API_KEY=tu_clave_api_de_gemini_aqui
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Configuración de Suno API (Opcional - para generación de audio de canciones)
SUNO_API_ENABLED=false
SUNO_API_KEY=tu_clave_api_de_suno_aqui
SUNO_API_URL=https://api.sunoapi.com/api/v1
```

**Nota sobre Suno API:**
- La generación de letras funciona sin Suno API (solo con Gemini)
- Si deseas generar audio/video completo, configura `SUNO_API_ENABLED=true` y proporciona tu API key de Suno
- Obtén una clave API de Suno en [suno.com](https://suno.com) o usa un servicio compatible

### 3. Configurar el Frontend

```bash
cd ../frontend
npm install
```

### 4. Ejecutar la Aplicación

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

El backend estará disponible en `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### 5. Compilar para Producción

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📚 API Endpoints

### Mazos de Tarot
- `GET /api/tarot/decks` - Obtener todos los mazos
- `GET /api/tarot/decks/:deckId` - Obtener un mazo específico
- `POST /api/tarot/decks/:deckId/shuffle` - Barajar y sacar cartas
- `GET /api/tarot/decks/:deckId/cards/:cardId` - Obtener una carta específica

### Tiradas
- `GET /api/tarot/spreads` - Obtener todas las tiradas predefinidas
- `GET /api/tarot/spreads/:spreadId` - Obtener una tirada específica

### Gemini AI
- `POST /api/gemini/reading` - Generar interpretación de una tirada
- `POST /api/gemini/image-description` - Generar descripción de imagen de carta
- `GET /api/gemini/card-placeholder/:deckId/:cardId` - Obtener placeholder de carta

### Generación de Música
- `GET /api/music/styles` - Obtener todos los estilos musicales disponibles
- `GET /api/music/styles/:styleId` - Obtener un estilo musical específico
- `POST /api/music/generate-lyrics` - Generar letras de canción con Gemini AI
- `POST /api/music/generate-song` - Generar canción completa (letras + audio si Suno está habilitado)
- `GET /api/music/song/:songId` - Consultar estado de una canción en generación
- `GET /api/music/suno-status` - Verificar si Suno API está habilitada y configurada

### Health Check
- `GET /api/health` - Verificar estado del servidor

## 🎮 Cómo Usar la Aplicación

### Paso 1: Selecciona un Mazo
Haz clic en uno de los mazos disponibles en la barra lateral izquierda.

### Paso 2: Elige un Tipo de Tirada (Opcional)
- **Tirada Libre**: Coloca las cartas donde quieras
- **Tirada de 4 Cartas**: Para situaciones cotidianas
- **Tirada de 8 Cartas**: Para análisis profundos

### Paso 3: Saca Cartas
Haz clic en "🎴 Sacar una Carta" para extraer cartas del mazo.

### Paso 4: Arrastra las Cartas al Tapete
Arrastra las cartas desde el área de cartas disponibles al tapete central.
- Si elegiste una tirada predefinida, las cartas se ajustarán a las posiciones sugeridas
- Puedes colocar cartas fuera de las posiciones si lo deseas

### Paso 5: Revela las Cartas
Haz clic en cada carta boca abajo para revelarla.

### Paso 6: Ajusta si es Necesario
- **Voltear**: Usa el botón 🔄 para cambiar la orientación
- **Quitar**: Usa el botón ✕ para quitar una carta
- **Mover**: Arrastra una carta revelada a otra posición

### Paso 7: Genera la Lectura
Haz clic en "🔮 Leer la Tirada" para obtener una interpretación con IA que incluye:
- Explicación de cada carta
- Lectura integrada de la tirada
- Afirmación personalizada
- Sugerencia de canción
- Elemento simbólico para altar
- Movimiento simbólico
- Visualización guiada
- Técnica de Tapping (EFT)
- Actitud para el día
- Recordatorio de gratitud

### Paso 8: Genera una Canción (Opcional)
Después de obtener tu lectura, puedes generar una canción personalizada:
1. Selecciona un estilo musical de los 6 disponibles
2. El sistema usará Gemini AI para crear letras profesionales basadas en tu lectura
3. Si Suno API está habilitado, se generará audio/video completo
4. Descarga o escucha tu canción personalizada

### Paso 9: Exporta tu Lectura y Tirada (Opcional)
- **Exportar Lectura en PDF**: Descarga tu lectura completa con imagen de la tirada
- **Compartir por Email**: Envía tu lectura por correo electrónico
- **Compartir por WhatsApp**: Comparte tu lectura en WhatsApp
- **Exportar Tirada Completa**: Botón "📸 Exportar Tirada"
- **Descargar Carta Individual**: Botón ⬇ en cada carta

## 🔧 Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **TypeScript** - Tipado estático
- **Google Generative AI (Gemini)** - Generación de lecturas y letras de canciones
- **Suno AI API** (opcional) - Generación de audio/video de canciones
- **CORS** - Manejo de Cross-Origin Resource Sharing
- **axios** - Cliente HTTP para llamadas a APIs externas

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **react-dnd** - Drag and drop
- **html2canvas** - Captura de pantalla para PDF
- **jsPDF** - Generación de documentos PDF
- **Tailwind CSS** - Estilos

## 📝 Estructura de Datos

### Carta de Tarot
```typescript
interface TarotCard {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  arcana?: 'major' | 'minor';
  suit?: 'cups' | 'wands' | 'swords' | 'pentacles';
  number?: number;
}
```

### Mazo
```typescript
interface TarotDeck {
  id: string;
  name: string;
  description: string;
  cards: TarotCard[];
}
```

### Tirada
```typescript
interface Spread {
  id: string;
  name: string;
  description: string;
  positions: SpreadPosition[];
}
```

### Estilo Musical
```typescript
interface MusicStyle {
  id: string;
  name: string;
  prompt: string; // Especificaciones técnicas (BPM, tonalidad, instrumentación)
}
```

### Solicitud de Generación de Canción
```typescript
interface SongGenerationRequest {
  readingSummary: string;  // Resumen de la lectura de tarot
  styleId: string;         // ID del estilo musical
  customPrompt?: string;   // Prompt personalizado opcional
}
```

### Respuesta de Generación de Canción
```typescript
interface SongGenerationResponse {
  id: string;
  title: string;
  lyrics: string;
  audioUrl?: string;       // URL del audio (si Suno está habilitado)
  videoUrl?: string;       // URL del video (si Suno está habilitado)
  imageUrl?: string;       // URL de la imagen (si Suno está habilitado)
  style: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  createdAt: string;
}
```

## 🎨 Personalización

### Agregar un Nuevo Mazo

1. Crea un archivo JSON en `backend/src/data/` (ejemplo: `tarot-nuevo.json`)
2. Sigue la estructura de los mazos existentes
3. El sistema lo detectará y cargará automáticamente

### Agregar una Nueva Tirada

1. Edita `backend/src/data/spreads.json`
2. Agrega un nuevo objeto con id, nombre, descripción y posiciones
3. Define las coordenadas X,Y para cada posición

### Cambiar el Modelo de IA

En `backend/src/services/gemini.service.ts`, cambia el modelo:
```typescript
this.textModel = genAI.getGenerativeModel({ model: 'otro-modelo' });
```

### Agregar un Nuevo Estilo Musical

1. Edita `backend/src/data/music-styles.json`
2. Agrega un nuevo estilo con la estructura:
```json
{
  "id": "mi-estilo-musical",
  "name": "Nombre del Estilo",
  "prompt": "Especificaciones técnicas: BPM, tonalidad, instrumentación, mood..."
}
```
3. El sistema lo cargará automáticamente y estará disponible en la API

### Personalizar el Prompt de Generación de Letras

En `backend/src/services/suno.service.ts`, modifica el método `generateSongLyrics` para ajustar:
- Estructura de las letras (versos, coros, puentes)
- Tono y voz del narrador
- Requisitos líricos específicos
- Longitud y formato

## 🐛 Solución de Problemas

### El backend no inicia
- Verifica que tienes un archivo `.env` con la clave API de Gemini
- Asegúrate de que el puerto 3001 no esté en uso

### El frontend no se conecta al backend
- Verifica que el backend esté corriendo en http://localhost:3001
- Revisa la configuración de CORS en el backend

### Las cartas no se arrastran
- Asegúrate de haber seleccionado un mazo
- Verifica que hayas sacado cartas del mazo

### Error al generar lectura
- Verifica tu clave API de Gemini
- Revisa que tengas cartas reveladas en el tapete

### Error al generar canciones
- **Solo letras (sin Suno)**: Verifica tu clave API de Gemini
- **Con Suno habilitado**:
  - Verifica que `SUNO_API_ENABLED=true` en `.env`
  - Confirma que tu clave API de Suno es válida
  - Revisa la URL de la API de Suno
  - Consulta los logs del backend para más detalles

### La generación de audio no funciona
- Verifica que Suno API esté habilitada: `GET /api/music/suno-status`
- Si solo necesitas letras, usa el endpoint `/api/music/generate-lyrics`
- El endpoint `/api/music/generate-song` requiere Suno API para audio completo

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 👥 Autores

- Desarrollador inicial - Super Tarot Team

## 🙏 Agradecimientos

- **Google Gemini AI** por la generación de interpretaciones de tarot y letras de canciones
- **Suno AI** por la plataforma de generación de música con IA
- Comunidad de **React** y **TypeScript**
- **react-dnd** por la funcionalidad drag & drop
- **jsPDF** y **html2canvas** por las capacidades de exportación
- Diseño inspirado en la estética del Tarot tradicional y la espiritualidad moderna

---

**Nota:** Esta aplicación es para entretenimiento y reflexión personal. Las lecturas de Tarot no deben ser utilizadas como sustituto de asesoramiento profesional.

🌙 ¡Disfruta de tu viaje espiritual con Super Tarot! ✨