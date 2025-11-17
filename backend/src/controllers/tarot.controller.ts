import { Request, Response } from 'express';
import { TarotDeck, Spread } from '../types';
import * as fs from 'fs';
import * as path from 'path';

export class TarotController {
  private decks: Map<string, TarotDeck> = new Map();
  private spreads: Spread[] = [];

  constructor() {
    this.loadDecks();
    this.loadSpreads();
  }

  /**
   * Carga todos los mazos de tarot desde los archivos JSON
   */
  private loadDecks() {
    const dataDir = path.join(__dirname, '../data');
    const deckFiles = [
      'tarot-marsella.json',
      'tarot-angeles.json',
      'tarot-diosas.json',
      'tarot-8.json'
    ];

    deckFiles.forEach(file => {
      try {
        const filePath = path.join(dataDir, file);
        const data = fs.readFileSync(filePath, 'utf-8');
        const deck: TarotDeck = JSON.parse(data);
        this.decks.set(deck.id, deck);
        console.log(`✅ Loaded deck: ${deck.name} (${deck.cards.length} cards)`);
      } catch (error) {
        console.error(`❌ Error loading deck ${file}:`, error);
      }
    });
  }

  /**
   * Carga las tiradas predefinidas
   */
  private loadSpreads() {
    try {
      const spreadsPath = path.join(__dirname, '../data/spreads.json');
      const data = fs.readFileSync(spreadsPath, 'utf-8');
      this.spreads = JSON.parse(data);
      console.log(`✅ Loaded ${this.spreads.length} spreads`);
    } catch (error) {
      console.error('❌ Error loading spreads:', error);
    }
  }

  /**
   * Obtiene la lista de todos los mazos disponibles
   */
  getAllDecks = (req: Request, res: Response) => {
    try {
      const decksArray = Array.from(this.decks.values()).map(deck => ({
        id: deck.id,
        name: deck.name,
        description: deck.description,
        cardCount: deck.cards.length
      }));

      res.json(decksArray);
    } catch (error) {
      console.error('Error getting decks:', error);
      res.status(500).json({ error: 'Failed to get decks' });
    }
  };

  /**
   * Obtiene un mazo específico por ID
   */
  getDeckById = (req: Request, res: Response) => {
    try {
      const { deckId } = req.params;
      const deck = this.decks.get(deckId);

      if (!deck) {
        return res.status(404).json({ error: 'Deck not found' });
      }

      res.json(deck);
    } catch (error) {
      console.error('Error getting deck:', error);
      res.status(500).json({ error: 'Failed to get deck' });
    }
  };

  /**
   * Obtiene una carta específica de un mazo
   */
  getCard = (req: Request, res: Response) => {
    try {
      const { deckId, cardId } = req.params;
      const deck = this.decks.get(deckId);

      if (!deck) {
        return res.status(404).json({ error: 'Deck not found' });
      }

      const card = deck.cards.find(c => c.id === cardId);

      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }

      res.json(card);
    } catch (error) {
      console.error('Error getting card:', error);
      res.status(500).json({ error: 'Failed to get card' });
    }
  };

  /**
   * Obtiene todas las tiradas predefinidas
   */
  getAllSpreads = (req: Request, res: Response) => {
    try {
      res.json(this.spreads);
    } catch (error) {
      console.error('Error getting spreads:', error);
      res.status(500).json({ error: 'Failed to get spreads' });
    }
  };

  /**
   * Obtiene una tirada específica por ID
   */
  getSpreadById = (req: Request, res: Response) => {
    try {
      const { spreadId } = req.params;
      const spread = this.spreads.find(s => s.id === spreadId);

      if (!spread) {
        return res.status(404).json({ error: 'Spread not found' });
      }

      res.json(spread);
    } catch (error) {
      console.error('Error getting spread:', error);
      res.status(500).json({ error: 'Failed to get spread' });
    }
  };

  /**
   * Baraja y obtiene cartas aleatorias de un mazo
   */
  shuffleAndDraw = (req: Request, res: Response) => {
    try {
      const { deckId } = req.params;
      const { count = 1 } = req.body;
      const deck = this.decks.get(deckId);

      if (!deck) {
        return res.status(404).json({ error: 'Deck not found' });
      }

      // Crear una copia del array de cartas y barajar
      const shuffled = [...deck.cards].sort(() => Math.random() - 0.5);
      const drawn = shuffled.slice(0, Math.min(count, deck.cards.length));

      res.json(drawn);
    } catch (error) {
      console.error('Error shuffling deck:', error);
      res.status(500).json({ error: 'Failed to shuffle deck' });
    }
  };
}

export default new TarotController();
