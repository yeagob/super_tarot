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

CARTAS SELECCIONADAS:
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
