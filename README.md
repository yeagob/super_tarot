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
- **Lectura con IA**: Interpretación de la tirada usando Gemini AI
- **Exportar Tirada**: Descarga una imagen de tu tirada completa
- **Descargar Cartas**: Descarga cartas individuales

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
│   ├── data/           # Archivos JSON con datos de mazos
│   ├── routes/         # Definición de rutas de la API
│   ├── services/       # Servicios (Gemini AI)
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
```

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
Haz clic en "🔮 Leer la Tirada" para obtener una interpretación con IA.

### Paso 8: Exporta tu Tirada (Opcional)
- **Exportar Tirada Completa**: Botón "📸 Exportar Tirada"
- **Descargar Carta Individual**: Botón ⬇ en cada carta

## 🔧 Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **TypeScript** - Tipado estático
- **Google Generative AI** - Integración con Gemini
- **CORS** - Manejo de Cross-Origin Resource Sharing

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **react-dnd** - Drag and drop
- **html2canvas** - Captura de pantalla
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

- Google Gemini AI por la generación de interpretaciones
- Comunidad de React y TypeScript
- Diseño inspirado en la estética del Tarot tradicional

---

**Nota:** Esta aplicación es para entretenimiento y reflexión personal. Las lecturas de Tarot no deben ser utilizadas como sustituto de asesoramiento profesional.

🌙 ¡Disfruta de tu viaje espiritual con Super Tarot! ✨