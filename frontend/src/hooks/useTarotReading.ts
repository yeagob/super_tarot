import { useState, useCallback } from 'react';
import { PlacedCard, TarotCard, TarotDeck, Spread } from '../types';
import { api } from '../services/api';

export const useTarotReading = () => {
  const [selectedDeck, setSelectedDeck] = useState<TarotDeck | null>(null);
  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);
  const [placedCards, setPlacedCards] = useState<PlacedCard[]>([]);
  const [allowReversed, setAllowReversed] = useState(true);
  const [reading, setReading] = useState<string | null>(null);
  const [isLoadingReading, setIsLoadingReading] = useState(false);

  const addCard = useCallback((card: TarotCard, deckId: string, x: number, y: number, positionId?: string) => {
    const isReversed = allowReversed && Math.random() > 0.5;

    const newCard: PlacedCard = {
      cardId: card.id,
      deckId,
      card,
      x,
      y,
      positionId,
      isRevealed: false,
      isReversed
    };

    setPlacedCards(prev => [...prev, newCard]);
  }, [allowReversed]);

  const removeCard = useCallback((cardId: string) => {
    setPlacedCards(prev => prev.filter(c => c.cardId !== cardId));
  }, []);

  const moveCard = useCallback((cardId: string, x: number, y: number, positionId?: string) => {
    setPlacedCards(prev => prev.map(card =>
      card.cardId === cardId
        ? { ...card, x, y, positionId }
        : card
    ));
  }, []);

  const revealCard = useCallback((cardId: string) => {
    setPlacedCards(prev => prev.map(card =>
      card.cardId === cardId
        ? { ...card, isRevealed: true }
        : card
    ));
  }, []);

  const flipCard = useCallback((cardId: string) => {
    setPlacedCards(prev => prev.map(card =>
      card.cardId === cardId
        ? { ...card, isReversed: !card.isReversed }
        : card
    ));
  }, []);

  const clearTable = useCallback(() => {
    setPlacedCards([]);
    setReading(null);
  }, []);

  const generateReading = useCallback(async () => {
    if (!selectedDeck || placedCards.length === 0) return;

    setIsLoadingReading(true);
    try {
      const response = await api.generateReading(
        placedCards,
        selectedDeck.id,
        selectedSpread?.id
      );
      setReading(response.interpretation);
    } catch (error) {
      console.error('Error generating reading:', error);
      alert('Error al generar la lectura. Por favor, intenta de nuevo.');
    } finally {
      setIsLoadingReading(false);
    }
  }, [selectedDeck, selectedSpread, placedCards]);

  return {
    selectedDeck,
    setSelectedDeck,
    selectedSpread,
    setSelectedSpread,
    placedCards,
    allowReversed,
    setAllowReversed,
    reading,
    isLoadingReading,
    addCard,
    removeCard,
    moveCard,
    revealCard,
    flipCard,
    clearTable,
    generateReading
  };
};
