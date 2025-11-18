import React, { useState, useEffect } from 'react';
import { TarotDeck, TarotCard } from '../types';
import { DraggableCard } from './DraggableCard';
import { api } from '../services/api';

interface DeckDisplayProps {
  deck: TarotDeck;
  placedCardIds: string[]; // IDs de cartas ya colocadas
  drawnCardIds: { [deckId: string]: string[] }; // IDs de cartas ya sacadas por mazo
  onMarkCardAsDrawn: (deckId: string, cardId: string) => void;
}

// Interfaz para cartas con ID único
interface DrawnCardWithId {
  card: TarotCard;
  uniqueId: string;
  deckId: string;
}

export const DeckDisplay: React.FC<DeckDisplayProps> = ({
  deck,
  placedCardIds,
  drawnCardIds,
  onMarkCardAsDrawn
}) => {
  const [drawnCards, setDrawnCards] = useState<DrawnCardWithId[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [nextId, setNextId] = useState(0);

  // Calcular cartas restantes de este mazo específico
  const remainingCardsCount = deck.cards.length - (drawnCardIds[deck.id]?.length || 0);

  // Generar imagen inmediatamente al sacar carta
  useEffect(() => {
    drawnCards.forEach(({ card, deckId }) => {
      api.getCardPlaceholder(deckId, card.id).catch(err =>
        console.error('Error pre-loading card image:', err)
      );
    });
  }, [drawnCards]);

  // Remover cartas que ya fueron colocadas en el tapete
  useEffect(() => {
    setDrawnCards(prev =>
      prev.filter(({ card }) => !placedCardIds.includes(card.id))
    );
  }, [placedCardIds]);

  const handleDrawCard = async () => {
    if (remainingCardsCount <= 0) {
      alert('No quedan más cartas en este mazo. Haz clic en "Nueva Tirada" para reiniciar.');
      return;
    }

    setIsDrawing(true);
    try {
      // Enviar las cartas ya sacadas de ESTE mazo específico
      const excludedCards = drawnCardIds[deck.id] || [];
      const cards = await api.shuffleDeck(deck.id, 1, excludedCards);

      if (cards.length === 0) {
        alert('No quedan más cartas en este mazo.');
        setIsDrawing(false);
        return;
      }

      const newCards: DrawnCardWithId[] = cards.map(card => {
        // Marcar carta como sacada de este mazo
        onMarkCardAsDrawn(deck.id, card.id);

        return {
          card,
          uniqueId: `${deck.id}-${card.id}-${nextId}`,
          deckId: deck.id
        };
      });

      setNextId(prev => prev + 1);
      setDrawnCards(prev => [...newCards, ...prev].slice(0, 10)); // Keep last 10 drawn cards
    } catch (error) {
      console.error('Error drawing card:', error);
    } finally {
      setIsDrawing(false);
    }
  };

  return (
    <div className="deck-display">
      <div className="mb-3 sm:mb-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg sm:text-xl font-bold text-tarot-gold">{deck.name}</h3>
          <span className="text-xs sm:text-sm text-tarot-silver/80 bg-tarot-navy/50 px-2 py-1 rounded">
            {remainingCardsCount}/{deck.cards.length}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-tarot-silver/70 mb-3 line-clamp-2">{deck.description}</p>
        <button
          onClick={handleDrawCard}
          disabled={isDrawing || remainingCardsCount <= 0}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-tarot-accent to-tarot-purple hover:from-tarot-purple hover:to-tarot-accent text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-mystic hover:shadow-mystic-lg text-sm sm:text-base"
        >
          {isDrawing ? '🌀 Barajando...' : remainingCardsCount <= 0 ? '❌ Sin Cartas' : '🎴 Sacar una Carta'}
        </button>
      </div>

      {drawnCards.length > 0 && (
        <div>
          <h4 className="text-sm sm:text-md font-semibold text-tarot-gold mb-2">
            Cartas Disponibles ({drawnCards.length})
          </h4>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {drawnCards.map(({ card, uniqueId, deckId }) => (
              <div key={uniqueId} className="animate-fade-in">
                <DraggableCard card={card} deckId={deckId} showDeckName={true} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-purple-900/30 rounded-lg border border-purple-400/30">
        <p className="text-xs text-gray-300">
          💡 <strong>Tip:</strong> Saca cartas y arrástralas al tapete para crear tu tirada.
          Puedes sacar tantas cartas como necesites.
        </p>
      </div>
    </div>
  );
};
