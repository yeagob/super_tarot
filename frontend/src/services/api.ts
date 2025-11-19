import { TarotDeck, TarotCard, Spread, PlacedCard, ReadingResponse } from '../types';
import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

export const api = {
  // Decks
  async getDecks(): Promise<TarotDeck[]> {
    const response = await fetch(`${API_BASE_URL}/tarot/decks`);
    if (!response.ok) throw new Error('Failed to fetch decks');
    return response.json();
  },

  async getDeck(deckId: string): Promise<TarotDeck> {
    const response = await fetch(`${API_BASE_URL}/tarot/decks/${deckId}`);
    if (!response.ok) throw new Error('Failed to fetch deck');
    return response.json();
  },

  async shuffleDeck(deckId: string, count: number = 1, excludedCardIds: string[] = []): Promise<TarotCard[]> {
    const response = await fetch(`${API_BASE_URL}/tarot/decks/${deckId}/shuffle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count, excludedCardIds })
    });
    if (!response.ok) throw new Error('Failed to shuffle deck');
    return response.json();
  },

  async getCard(deckId: string, cardId: string): Promise<TarotCard> {
    const response = await fetch(`${API_BASE_URL}/tarot/decks/${deckId}/cards/${cardId}`);
    if (!response.ok) throw new Error('Failed to fetch card');
    return response.json();
  },

  // Spreads
  async getSpreads(): Promise<Spread[]> {
    const response = await fetch(`${API_BASE_URL}/tarot/spreads`);
    if (!response.ok) throw new Error('Failed to fetch spreads');
    return response.json();
  },

  async getSpread(spreadId: string): Promise<Spread> {
    const response = await fetch(`${API_BASE_URL}/tarot/spreads/${spreadId}`);
    if (!response.ok) throw new Error('Failed to fetch spread');
    return response.json();
  },

  // Gemini
  async generateReading(cards: PlacedCard[], deckId: string, spreadId?: string): Promise<ReadingResponse> {
    const response = await fetch(`${API_BASE_URL}/gemini/reading`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deckId,
        spreadId,
        cards
      })
    });
    if (!response.ok) throw new Error('Failed to generate reading');
    return response.json();
  },

  async getCardPlaceholder(deckId: string, cardId: string): Promise<{ imageUrl: string }> {
    const response = await fetch(`${API_BASE_URL}/gemini/card-placeholder/${deckId}/${cardId}`);
    if (!response.ok) throw new Error('Failed to get card placeholder');
    return response.json();
  },

  async analyzePhoto(imageBase64: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/gemini/analyze-photo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64 })
    });
    if (!response.ok) throw new Error('Failed to analyze photo');
    return response.json();
  }
};
