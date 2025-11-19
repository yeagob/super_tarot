/**
 * Configuración de la API del backend
 *
 * En desarrollo: usa localhost:3001 por defecto
 * En producción: usa la variable de entorno VITE_API_URL o '/api' como fallback
 */

const getApiUrl = (): string => {
  // En desarrollo
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  }

  // En producción
  return import.meta.env.VITE_API_URL || '/api';
};

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  EDITOR_URL: `${getApiUrl()}/editor`,
  TAROT_URL: `${getApiUrl()}/tarot`,
  GEMINI_URL: `${getApiUrl()}/gemini`,
};

// Para debugging
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', API_CONFIG);
}
