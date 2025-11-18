import { GoogleGenAI } from '@google/genai';
import { ReadingRequest, ImageGenerationRequest } from '../types';

// Verificar que existe la API Key
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ ERROR: GEMINI_API_KEY no está configurada en .env');
  console.error('📝 Por favor crea el archivo backend/.env con: GEMINI_API_KEY=tu_clave_aqui');
  console.error('🌐 Obtén tu API key gratis en: https://makersuite.google.com/app/apikey');
}

// Inicializar Gemini AI con la nueva SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export class GeminiService {
  private model: string;

  constructor() {
    // Usar modelo estable gemini-2.5-flash (nueva generación)
    this.model = 'gemini-2.5-flash';
    console.log(`✅ GeminiService inicializado con modelo: ${this.model}`);
  }

  /**
   * Genera una interpretación completa y profunda de la tirada de tarot usando Gemini
   */
  async generateReading(request: ReadingRequest): Promise<string> {
    try {
      const { deckId, spreadId, cards } = request;

      // Construir descripción detallada de las cartas
      const cardsDescription = cards.map((card, index) => {
        const position = card.positionId ? `Posición ${index + 1}` : `Carta ${index + 1}`;
        const orientation = card.isReversed ? '(Invertida)' : '(Normal)';
        const cardInfo = card.card ? `- ${card.card.name}: ${card.card.description}` : '';
        return `${position}: ${cardInfo} ${orientation}`;
      }).join('\n');

      const prompt = `Eres una inteligencia artificial diseñada para ofrecer lecturas de tarot personalizadas y profundas, basadas en una combinación de cartas seleccionadas por el usuario. Tu objetivo es guiar al usuario a través de una experiencia introspectiva, espiritual y práctica.

CONTEXTO DE LA TIRADA:
- Mazo utilizado: ${deckId}
- Tipo de tirada: ${spreadId || 'libre'}
- Número de cartas: ${cards.length}
- IMPORTANTE: Las cartas se presentan en ORDEN DE LECTURA: de izquierda a derecha, de arriba hacia abajo. La primera carta listada es la posición superior izquierda, y así sucesivamente.

CARTAS SELECCIONADAS (en orden de lectura):
${cardsDescription}

Por favor, proporciona una lectura detallada siguiendo EXACTAMENTE esta estructura. Cada sección debe ser rica, profunda y personalizada:

## A. EXPLICACIÓN DE CADA CARTA
Proporciona una descripción profunda del significado de cada carta en esta tirada específica. Incluye simbolismo tradicional e interpretaciones personales introspectivas.

## B. LECTURA INTEGRADA DE LA TIRADA
Integra todas las cartas en una narrativa coherente. Explica cómo interactúan las energías entre sí y qué mensaje global transmiten para el momento presente del consultante.

## C. AFIRMACIÓN
Proporciona UNA afirmación poderosa (1-2 frases máximo) que capture el mensaje central de esta tirada. Debe ser positiva, inspiradora y fácil de recordar.

## D. SUGERENCIA DE CANCIÓN
Sugiere UNA canción específica (con artista) que refuerce la energía o tema de esta lectura. Explica brevemente por qué esta canción complementa la tirada.

## E. ALTAR - ELEMENTO SIMBÓLICO
Propón UN objeto simbólico que el usuario pueda añadir o cambiar en su altar personal. Describe cómo este objeto sirve como recordatorio del mensaje de la tirada.

## F. MOVIMIENTO SIMBÓLICO (Propuesta de Movimiento Libre)
Describe UNA metáfora física o movimiento simbólico que represente la energía de esta tirada. Incluye:
- Frase que acompaña el movimiento
- Ejemplos simples de cómo ejecutarlo (sin pasos rígidos, dejando espacio para creatividad)

## G. VISUALIZACIÓN (Autohipnosis)
Diseña una visualización guiada completa que incluya:
1. Preparación inicial (respiración, encontrar espacio tranquilo)
2. Escena imaginaria detallada que refleje la energía de las cartas
3. Frases clave para repetir durante la visualización
4. Cierre suave que regrese al presente

## H. TAPPING (EFT)
Proporciona un script COMPLETO de tapping con frases específicas para cada punto:
- Punto de inicio (lado de la mano)
- Ceja
- Lado del ojo
- Bajo el ojo
- Bajo la nariz
- Barbilla
- Clavícula
- Bajo el brazo
- Encima de la cabeza
(Asegúrate de que TODAS las frases sean relevantes al mensaje de las cartas)

## I. ACTITUD PARA EL DÍA
Sugiere UNA actitud o postura mental clara para adoptar durante el día. Incluye una frase breve de recordatorio relacionada con el mensaje de la tirada.

## J. RECUERDA AGRADECER
Proporciona 3-5 sugerencias específicas de cosas por las que agradecer durante el día, relacionadas con el mensaje de las cartas. Incluye una frase de gratitud para repetir.

IMPORTANTE:
- Usa un tono compasivo, inspirador y accesible
- Evita lenguaje técnico; enfócate en claridad y aplicabilidad
- Incorpora metáforas y ejemplos visuales
- Personaliza TODO según las cartas específicas de esta tirada
- Sé específico y práctico en cada sección`;

      const response = await ai.models.generateContent({
        model: this.model,
        contents: prompt
      });
      return response.text;
    } catch (error) {
      console.error('Error generating reading:', error);
      throw new Error('Failed to generate tarot reading');
    }
  }

  /**
   * Genera una imagen de una carta de tarot usando Gemini (simulación)
   * Nota: Gemini actualmente no genera imágenes directamente en esta API
   * Esta función retorna un prompt descriptivo que podría usarse con un generador de imágenes
   */
  async generateCardImage(request: ImageGenerationRequest): Promise<string> {
    try {
      const { deckName, cardName, description } = request;

      const prompt = `Describe en detalle cómo sería visualmente una carta de tarot con las siguientes características:

Mazo: ${deckName}
Carta: ${cardName}
Descripción: ${description}

Proporciona una descripción visual detallada que incluya:
- Elementos visuales principales
- Colores predominantes
- Símbolos importantes
- Atmósfera y estilo artístico
- Detalles decorativos

La descripción debe ser lo suficientemente detallada como para que un artista pueda crear la imagen.`;

      const response = await ai.models.generateContent({
        model: this.model,
        contents: prompt
      });

      // En un escenario real, aquí se llamaría a un servicio de generación de imágenes
      // Por ahora, retornamos la descripción como placeholder
      return response.text;
    } catch (error) {
      console.error('Error generating card image description:', error);
      throw new Error('Failed to generate card image description');
    }
  }

  /**
   * Genera una URL de imagen real para una carta usando IA
   * Usa Pollinations.AI para generar imágenes gratis sin API key
   */
  async getCardImagePlaceholder(deckId: string, cardId: string): Promise<string> {
    try {
      // Obtener información de la carta para generar un prompt descriptivo
      const cardInfo = await this.getCardInfo(deckId, cardId);

      if (!cardInfo) {
        return this.generateSVGPlaceholder(cardId);
      }

      // Crear prompt detallado para generación de imagen
      const imagePrompt = this.createImagePrompt(deckId, cardInfo);

      // Usar Pollinations.AI para generar imagen (GRATIS, sin API key)
      const encodedPrompt = encodeURIComponent(imagePrompt);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=400&height=600&seed=${this.hashCode(cardId)}&nologo=true`;

      console.log(`🎨 Generating image for ${cardInfo.name}: ${imageUrl.substring(0, 100)}...`);

      return imageUrl;
    } catch (error) {
      console.error('Error generating card image:', error);
      return this.generateSVGPlaceholder(cardId);
    }
  }

  /**
   * Obtiene información de una carta específica
   */
  private async getCardInfo(deckId: string, cardId: string): Promise<any> {
    try {
      const fs = require('fs');
      const path = require('path');

      const deckFiles: { [key: string]: string } = {
        'tarot-marsella': 'tarot-marsella.json',
        'tarot-angeles': 'tarot-angeles.json',
        'tarot-diosas': 'tarot-diosas.json',
        'tarot-osho': 'tarot-osho.json'
      };

      const fileName = deckFiles[deckId];
      if (!fileName) return null;

      const filePath = path.join(__dirname, '../data', fileName);
      const data = fs.readFileSync(filePath, 'utf-8');
      const deck = JSON.parse(data);

      return deck.cards.find((c: any) => c.id === cardId);
    } catch (error) {
      console.error('Error reading card info:', error);
      return null;
    }
  }

  /**
   * Crea un prompt optimizado para generación de imagen de tarot
   */
  private createImagePrompt(deckId: string, cardInfo: any): string {
    const deckStyles: { [key: string]: string } = {
      'tarot-marsella': 'traditional Marseille tarot card style, medieval art, vintage engraving',
      'tarot-angeles': 'ethereal angel tarot card, soft glowing light, celestial atmosphere, wings and halos',
      'tarot-diosas': 'goddess tarot card, divine feminine energy, mystical feminine power, sacred symbols',
      'tarot-osho': 'Zen Osho tarot card, meditative spiritual art, consciousness and awareness, modern mystical'
    };

    const styleGuide = deckStyles[deckId] || 'mystical tarot card art';

    // Crear prompt conciso pero descriptivo
    const prompt = `${cardInfo.name} tarot card, ${styleGuide}, ${cardInfo.keywords.slice(0, 3).join(', ')}, ornate border, symbolic imagery, professional tarot card design, high quality illustration`;

    return prompt;
  }

  /**
   * Genera hash numérico estable desde string
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Genera SVG placeholder como fallback
   */
  private generateSVGPlaceholder(cardId: string): string {
    const hash = this.hashCode(cardId);
    const hue = hash % 360;
    const saturation = 60 + (hash % 20);
    const lightness = 40 + ((hash >> 8) % 20);

    const color1 = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const color2 = `hsl(${(hue + 30) % 360}, ${saturation}%, ${lightness + 10}%)`;

    const svg = `
      <svg width="200" height="350" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-${cardId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="200" height="350" fill="url(#grad-${cardId})" rx="10"/>
        <text x="100" y="175" font-size="24" fill="white" text-anchor="middle" font-family="serif">
          🌙
        </text>
        <text x="100" y="210" font-size="12" fill="white" text-anchor="middle" font-family="serif" opacity="0.8">
          ${cardId}
        </text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  }
}

export default new GeminiService();
