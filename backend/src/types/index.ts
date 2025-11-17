export interface TarotCard {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  arcana?: 'major' | 'minor';
  suit?: 'cups' | 'wands' | 'swords' | 'pentacles';
  number?: number;
}

export interface TarotDeck {
  id: string;
  name: string;
  description: string;
  cards: TarotCard[];
}

export interface SpreadPosition {
  id: string;
  name: string;
  meaning: string;
  x: number;
  y: number;
}

export interface Spread {
  id: string;
  name: string;
  description: string;
  positions: SpreadPosition[];
}

export interface PlacedCard {
  cardId: string;
  deckId: string;
  positionId?: string;
  x: number;
  y: number;
  isRevealed: boolean;
  isReversed: boolean;
  imageUrl?: string;
}

export interface ReadingRequest {
  deckId: string;
  spreadId?: string;
  cards: PlacedCard[];
}

export interface ReadingResponse {
  interpretation: string;
  timestamp: string;
}

export interface ImageGenerationRequest {
  deckName: string;
  cardName: string;
  description: string;
}
