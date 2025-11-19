# Frontend - Super Tarot

Frontend de la aplicación de lecturas de tarot con IA, construido con React, TypeScript y Vite.

## 🚀 Configuración

### Variables de Entorno

El frontend utiliza variables de entorno para configurar la URL del backend API.

1. **Copia el archivo de ejemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Configura la URL del backend:**

   Edita el archivo `.env` y establece `VITE_API_URL` según tu entorno:

   **Desarrollo local:**
   ```env
   VITE_API_URL=http://localhost:3001
   ```

   **Producción (Render):**
   ```env
   VITE_API_URL=https://tarot-backend-uugn.onrender.com
   ```

   **Mismo dominio:**
   ```env
   VITE_API_URL=/api
   ```

### Valores por Defecto

- **Desarrollo**: Si no se especifica `VITE_API_URL`, usa `http://localhost:3001/api`
- **Producción**: Si no se especifica `VITE_API_URL`, usa `/api` (rutas relativas)

## 📦 Instalación

```bash
npm install
```

## 🛠️ Desarrollo

```bash
npm run dev
```

El servidor de desarrollo se ejecutará en `http://localhost:5173`

## 🏗️ Build para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`

### Preview de Producción

```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/      # Componentes React
│   ├── config/          # Configuración (API, etc.)
│   ├── hooks/           # React Hooks personalizados
│   ├── services/        # Servicios API
│   ├── types/           # Tipos TypeScript
│   └── App.tsx          # Componente principal
├── .env.example         # Ejemplo de variables de entorno
├── vite.config.ts       # Configuración de Vite
└── package.json
```

## 🔧 Configuración de API

El archivo `src/config/api.ts` centraliza toda la configuración de las URLs del backend:

```typescript
export const API_CONFIG = {
  BASE_URL: getApiUrl(),           // URL base de la API
  EDITOR_URL: `${getApiUrl()}/editor`,  // Endpoints del editor
  TAROT_URL: `${getApiUrl()}/tarot`,    // Endpoints de tarot
  GEMINI_URL: `${getApiUrl()}/gemini`,  // Endpoints de IA
};
```

## 🌐 Despliegue

### Opción 1: Netlify / Vercel

1. Conecta tu repositorio
2. Configura la variable de entorno `VITE_API_URL`
3. El comando de build es: `npm run build`
4. El directorio de publicación es: `dist`

### Opción 2: Servidor estático

1. Ejecuta `npm run build`
2. Sube el contenido de `dist/` a tu servidor
3. Configura las variables de entorno antes del build

## 🔍 Debugging

Para ver la configuración de la API en desarrollo, abre la consola del navegador. Verás un mensaje como:

```
🔧 API Configuration: {
  BASE_URL: "http://localhost:3001/api",
  EDITOR_URL: "http://localhost:3001/api/editor",
  ...
}
```
