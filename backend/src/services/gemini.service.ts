import { GoogleGenerativeAI } from '@google/generative-ai';
import { ReadingRequest, ImageGenerationRequest } from '../types';

// Inicializar Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class GeminiService {
  private textModel;
  private imageModel;

  constructor() {
    this.textModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    this.imageModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }

  /**
   * Genera una interpretación de la tirada de tarot usando Gemini
   */
  async generateReading(request: ReadingRequest): Promise<string> {
    try {
      const { deckId, spreadId, cards } = request;

      // Construir el prompt para Gemini
      const cardsDescription = cards.map((card, index) => {
        const position = card.positionId ? `Posición ${index + 1}` : `Carta ${index + 1}`;
        const orientation = card.isReversed ? '(Invertida)' : '(Normal)';
        return `${position}: Carta ID ${card.cardId} ${orientation}`;
      }).join('\n');

      const prompt = `Eres un experto lector de tarot. Se te ha consultado para interpretar una tirada de tarot.

Detalles de la tirada:
- Mazo utilizado: ${deckId}
- Tirada: ${spreadId || 'libre'}
- Número de cartas: ${cards.length}

Cartas en la tirada:
${cardsDescription}

Por favor, proporciona una interpretación detallada y perspicaz de esta tirada de tarot.
Considera las posiciones de las cartas, si están invertidas, y cómo se relacionan entre sí.
La interpretación debe ser:
1. Profunda pero accesible
2. Positiva pero honesta
3. Práctica y aplicable
4. De 3-4 párrafos

Estructura la interpretación en:
- Visión General
- Significado de las Cartas Clave
- Consejo y Reflexión Final`;

      const result = await this.textModel.generateContent(prompt);
      const response = result.response;
      return response.text();
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

      const result = await this.textModel.generateContent(prompt);
      const response = result.response;

      // En un escenario real, aquí se llamaría a un servicio de generación de imágenes
      // Por ahora, retornamos la descripción como placeholder
      return response.text();
    } catch (error) {
      console.error('Error generating card image description:', error);
      throw new Error('Failed to generate card image description');
    }
  }

  /**
   * Genera una URL de placeholder para la imagen de una carta
   * En producción, esto se reemplazaría con generación real de imágenes
   */
  async getCardImagePlaceholder(deckId: string, cardId: string): Promise<string> {
    // Generar un color basado en el hash del cardId
    const hash = cardId.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const hue = Math.abs(hash % 360);
    const saturation = 60 + (Math.abs(hash) % 20);
    const lightness = 40 + (Math.abs(hash >> 8) % 20);

    // Crear una imagen placeholder con gradiente
    const color1 = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const color2 = `hsl(${(hue + 30) % 360}, ${saturation}%, ${lightness + 10}%)`;

    // Retornar SVG como data URL
    const svg = `
      <svg width="200" height="350" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad${cardId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="200" height="350" fill="url(#grad${cardId})" rx="10"/>
        <rect x="10" y="10" width="180" height="330" fill="none" stroke="gold" stroke-width="2" rx="5"/>
        <text x="100" y="180" font-family="serif" font-size="16" fill="white" text-anchor="middle">
          ${cardId}
        </text>
      </svg>
    `.trim();

    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  }
}

export default new GeminiService();
