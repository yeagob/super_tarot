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
  cardCount?: number;
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
  card?: TarotCard;
  positionId?: string;
  x: number;
  y: number;
  isRevealed: boolean;
  isReversed: boolean;
  imageUrl?: string;
}

export interface ReadingResponse {
  interpretation: string;
  timestamp: string;
}

export interface DragItem {
  type: string;
  card: TarotCard;
  deckId: string;
  placedCardId?: string;
}
