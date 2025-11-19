import { GoogleGenAI } from '@google/genai';
import { SongGenerationRequest, SongLyricsResponse, SongGenerationResponse, MusicStyle } from '../types';
import * as fs from 'fs';
import * as path from 'path';

// Inicializar Gemini AI con la nueva SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export class SunoService {
  private model: string;
  private musicStyles: MusicStyle[] = [];
  private sunoApiEnabled: boolean;
  private sunoApiKey: string;
  private sunoApiUrl: string;

  constructor() {
    // Usar modelo estable gemini-2.5-flash
    this.model = 'gemini-2.5-flash';
    this.sunoApiEnabled = process.env.SUNO_API_ENABLED === 'true';
    this.sunoApiKey = process.env.SUNO_API_KEY || '';
    this.sunoApiUrl = process.env.SUNO_API_URL || 'https://api.sunoapi.com/api/v1';
    this.loadMusicStyles();
    console.log(`✅ SunoService inicializado con modelo: ${this.model}`);
  }

  /**
   * Carga los estilos musicales desde el archivo JSON
   */
  private loadMusicStyles() {
    try {
      const stylesPath = path.join(__dirname, '../data/music-styles.json');
      const data = fs.readFileSync(stylesPath, 'utf-8');
      this.musicStyles = JSON.parse(data);
      console.log(`✅ Loaded ${this.musicStyles.length} music styles`);
    } catch (error) {
      console.error('❌ Error loading music styles:', error);
      this.musicStyles = [];
    }
  }

  /**
   * Obtiene todos los estilos musicales disponibles
   */
  getMusicStyles(): MusicStyle[] {
    return this.musicStyles;
  }

  /**
   * Obtiene un estilo musical por ID
   */
  getMusicStyleById(styleId: string): MusicStyle | undefined {
    return this.musicStyles.find(style => style.id === styleId);
  }

  /**
   * Verifica si la API de Suno está habilitada
   */
  isSunoApiEnabled(): boolean {
    return this.sunoApiEnabled && !!this.sunoApiKey;
  }

  /**
   * Genera la letra de una canción usando Gemini basada en la lectura de tarot
   */
  async generateSongLyrics(request: SongGenerationRequest): Promise<SongLyricsResponse> {
    try {
      const { readingSummary, styleId, customPrompt } = request;
      const style = this.getMusicStyleById(styleId);

      if (!style) {
        throw new Error(`Music style with id '${styleId}' not found`);
      }

      // Construir el prompt para Gemini
      const prompt = `Eres un EXPERTO PRODUCTOR MUSICAL Y LETRISTA PROFESIONAL con años de experiencia creando canciones emotivas y coherentes que conectan profundamente con las personas.

Tu misión es crear una letra de canción PROFESIONAL, COHERENTE y EMOTIVA basada en la siguiente lectura de tarot.

RESUMEN DE LA LECTURA DE TAROT:
${readingSummary}

ESTILO MUSICAL REQUERIDO:
${style.name}

ESPECIFICACIONES TÉCNICAS DE PRODUCCIÓN:
${style.prompt}

${customPrompt ? `\nINSTRUCCIONES ADICIONALES DEL USUARIO:\n${customPrompt}` : ''}

REQUISITOS PARA LA LETRA:

1. **Coherencia Total**: La letra debe contar una historia unificada que refleje los temas y mensajes de la lectura de tarot.

2. **Estructura Profesional**:
   - Título pegadizo y memorable
   - Verso 1: Introduce la situación/sentimiento
   - Coro: Hook memorable que capture el mensaje central
   - Verso 2: Desarrolla la historia/emoción
   - Puente: Momento de reflexión o cambio de perspectiva
   - Coro Final: Refuerza el mensaje con mayor intensidad

3. **Calidad Lírica**:
   - Usa metáforas visuales potentes relacionadas con los símbolos del tarot
   - Crea rimas naturales (no forzadas)
   - Mantén un flujo melódico consistente
   - Evita clichés obvios
   - Incorpora los temas emocionales de la lectura de manera sutil

4. **Tono y Voz**:
   - Adapta el tono a las características del estilo musical especificado
   - Usa el idioma que mejor se adapte al estilo (español, inglés o mezcla según el estilo)
   - Mantén autenticidad emocional

5. **Formato de Salida**:
   Proporciona la letra en el siguiente formato EXACTO:

   **[TÍTULO DE LA CANCIÓN]**

   [Intro]
   (descripción breve si aplica)

   [Verso 1]
   (letra del verso 1)

   [Coro]
   (letra del coro)

   [Verso 2]
   (letra del verso 2)

   [Puente]
   (letra del puente)

   [Coro Final]
   (letra del coro con posibles variaciones)

   [Outro]
   (descripción breve si aplica)

RECUERDA: Esta letra será grabada por cantantes profesionales y debe sonar NATURAL cuando se cante. Enfócate en crear algo HERMOSO, EMOTIVO y PROFESIONAL que honre el mensaje de la lectura de tarot.

¡Crea una obra maestra!`;

      const response = await ai.models.generateContent({
        model: this.model,
        contents: prompt
      });
      const lyrics = response.text || '';

      return {
        lyrics,
        style: style.name,
        stylePrompt: style.prompt
      };
    } catch (error) {
      console.error('Error generating song lyrics:', error);
      throw new Error('Failed to generate song lyrics');
    }
  }

  /**
   * Genera una canción usando la API de Suno
   * Nota: Esta implementación es genérica y debe adaptarse según el proveedor de API elegido
   */
  async generateSongWithSuno(lyrics: string, style: MusicStyle, title: string): Promise<SongGenerationResponse> {
    if (!this.isSunoApiEnabled()) {
      throw new Error('Suno API is not enabled. Please configure SUNO_API_KEY in your .env file.');
    }

    try {
      // Implementación genérica para APIs de Suno de terceros
      // Este código debe adaptarse según el proveedor específico (sunoapi.com, musicapi.ai, etc.)

      const payload = {
        custom_mode: true,
        mv: 'chirp-v4', // Modelo de Suno (puede ser v3.5, v4, v4.5, v5)
        title: title,
        tags: style.name,
        prompt: `${style.prompt}\n\n${lyrics}`,
        make_instrumental: false,
        wait_audio: true // Esperar a que el audio esté listo
      };

      const response = await fetch(`${this.sunoApiUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.sunoApiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Suno API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json() as any;

      // El formato de respuesta varía según el proveedor
      // Esta es una estructura genérica que debe adaptarse
      return {
        id: data.id || data.task_id || `song-${Date.now()}`,
        title: title,
        lyrics: lyrics,
        audioUrl: data.audio_url || data.mp3_url || data.audio,
        videoUrl: data.video_url || data.mp4_url || data.video,
        imageUrl: data.image_url || data.cover_url || data.image,
        style: style.name,
        status: data.status || 'completed',
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error calling Suno API:', error);
      throw new Error(`Failed to generate song with Suno: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Proceso completo: Genera letra con Gemini y luego canción con Suno
   */
  async generateCompleteSong(request: SongGenerationRequest): Promise<{
    lyrics: SongLyricsResponse;
    song?: SongGenerationResponse;
  }> {
    try {
      // Paso 1: Generar letra con Gemini
      const lyricsResponse = await this.generateSongLyrics(request);

      // Extraer título de la letra generada
      const titleMatch = lyricsResponse.lyrics.match(/\*\*\[(.*?)\]\*\*/);
      const title = titleMatch ? titleMatch[1] : 'Canción de Tarot';

      const result: {
        lyrics: SongLyricsResponse;
        song?: SongGenerationResponse;
      } = {
        lyrics: lyricsResponse
      };

      // Paso 2: Si Suno está habilitado, generar la canción
      if (this.isSunoApiEnabled()) {
        const style = this.getMusicStyleById(request.styleId);
        if (style) {
          const songResponse = await this.generateSongWithSuno(
            lyricsResponse.lyrics,
            style,
            title
          );
          result.song = songResponse;
        }
      }

      return result;
    } catch (error) {
      console.error('Error in complete song generation:', error);
      throw error;
    }
  }

  /**
   * Consulta el estado de una canción en generación
   */
  async getSongStatus(songId: string): Promise<SongGenerationResponse> {
    if (!this.isSunoApiEnabled()) {
      throw new Error('Suno API is not enabled');
    }

    try {
      const response = await fetch(`${this.sunoApiUrl}/query?ids=${songId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.sunoApiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Suno API error: ${response.status}`);
      }

      const data = await response.json();
      const songData = Array.isArray(data) ? data[0] : data;

      return {
        id: songData.id,
        title: songData.title,
        lyrics: songData.lyric || songData.lyrics || '',
        audioUrl: songData.audio_url || songData.mp3_url,
        videoUrl: songData.video_url || songData.mp4_url,
        imageUrl: songData.image_url || songData.cover_url,
        style: songData.tags || '',
        status: songData.status || 'completed',
        createdAt: songData.created_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting song status:', error);
      throw error;
    }
  }
}

export default new SunoService();
