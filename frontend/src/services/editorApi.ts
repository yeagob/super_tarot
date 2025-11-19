import { TarotCard } from '../types';
import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.EDITOR_URL;

export interface DeckSummary {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  fileName: string;
}

export interface DeckFull {
  id: string;
  name: string;
  description: string;
  cards: TarotCard[];
}

export interface CreateDeckRequest {
  id: string;
  name: string;
  description?: string;
}

export interface UpdateDeckRequest {
  name?: string;
  description?: string;
  cards?: TarotCard[];
}

export interface CreateCardRequest {
  id: string;
  name: string;
  description?: string;
  keywords?: string[];
  uprightMeaning?: string;
  reversedMeaning?: string;
  arcana?: 'major' | 'minor';
  number?: number | null;
}

export interface DuplicateDeckRequest {
  newId: string;
  newName: string;
}

class EditorApiService {
  /**
   * Listar todos los mazos
   */
  async listDecks(): Promise<DeckSummary[]> {
    const response = await fetch(`${API_BASE_URL}/decks`);
    if (!response.ok) throw new Error('Failed to list decks');
    return response.json();
  }

  /**
   * Obtener un mazo específico con todas sus cartas
   */
  async getDeck(deckId: string): Promise<DeckFull> {
    const response = await fetch(`${API_BASE_URL}/decks/${deckId}`);
    if (!response.ok) throw new Error('Failed to get deck');
    return response.json();
  }

  /**
   * Crear un nuevo mazo
   */
  async createDeck(data: CreateDeckRequest): Promise<DeckFull> {
    const response = await fetch(`${API_BASE_URL}/decks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create deck');
    }
    return response.json();
  }

  /**
   * Actualizar un mazo
   */
  async updateDeck(deckId: string, data: UpdateDeckRequest): Promise<DeckFull> {
    const response = await fetch(`${API_BASE_URL}/decks/${deckId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update deck');
    return response.json();
  }

  /**
   * Eliminar un mazo
   */
  async deleteDeck(deckId: string): Promise<{ message: string; backup: string }> {
    const response = await fetch(`${API_BASE_URL}/decks/${deckId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete deck');
    return response.json();
  }

  /**
   * Duplicar un mazo
   */
  async duplicateDeck(deckId: string, data: DuplicateDeckRequest): Promise<DeckFull> {
    const response = await fetch(`${API_BASE_URL}/decks/${deckId}/duplicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to duplicate deck');
    }
    return response.json();
  }

  /**
   * Añadir una carta a un mazo
   */
  async addCard(deckId: string, data: CreateCardRequest): Promise<TarotCard> {
    const response = await fetch(`${API_BASE_URL}/decks/${deckId}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add card');
    }
    return response.json();
  }

  /**
   * Actualizar una carta
   */
  async updateCard(deckId: string, cardId: string, data: Partial<TarotCard>): Promise<TarotCard> {
    const response = await fetch(`${API_BASE_URL}/decks/${deckId}/cards/${cardId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update card');
    return response.json();
  }

  /**
   * Eliminar una carta
   */
  async deleteCard(deckId: string, cardId: string): Promise<{ message: string; card: TarotCard }> {
    const response = await fetch(`${API_BASE_URL}/decks/${deckId}/cards/${cardId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete card');
    return response.json();
  }
}

export const editorApi = new EditorApiService();
