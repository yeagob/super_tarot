import { Request, Response } from 'express';
import geminiService from '../services/gemini.service';
import { ReadingRequest, ImageGenerationRequest } from '../types';

export class GeminiController {
  /**
   * Genera una lectura de tarot usando Gemini
   */
  generateReading = async (req: Request, res: Response) => {
    try {
      const readingRequest: ReadingRequest = req.body;

      if (!readingRequest.cards || readingRequest.cards.length === 0) {
        return res.status(400).json({ error: 'No cards provided for reading' });
      }

      const interpretation = await geminiService.generateReading(readingRequest);

      res.json({
        interpretation,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error generating reading:', error);
      res.status(500).json({
        error: 'Failed to generate reading',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Genera una descripción de imagen para una carta
   */
  generateCardImageDescription = async (req: Request, res: Response) => {
    try {
      const imageRequest: ImageGenerationRequest = req.body;

      if (!imageRequest.deckName || !imageRequest.cardName) {
        return res.status(400).json({ error: 'Deck name and card name are required' });
      }

      const description = await geminiService.generateCardImage(imageRequest);

      res.json({
        description,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error generating image description:', error);
      res.status(500).json({
        error: 'Failed to generate image description',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Obtiene una imagen placeholder para una carta
   */
  getCardImagePlaceholder = async (req: Request, res: Response) => {
    try {
      const { deckId, cardId } = req.params;

      if (!deckId || !cardId) {
        return res.status(400).json({ error: 'Deck ID and card ID are required' });
      }

      const imageUrl = await geminiService.getCardImagePlaceholder(deckId, cardId);

      res.json({
        imageUrl,
        deckId,
        cardId
      });
    } catch (error) {
      console.error('Error getting card placeholder:', error);
      res.status(500).json({
        error: 'Failed to get card placeholder',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}

export default new GeminiController();
