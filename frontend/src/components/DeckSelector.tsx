import React, { useEffect, useState } from 'react';
import { TarotDeck } from '../types';
import { api } from '../services/api';

interface DeckSelectorProps {
  onSelectDeck: (deck: TarotDeck) => void;
  selectedDeck: TarotDeck | null;
}

export const DeckSelector: React.FC<DeckSelectorProps> = ({ onSelectDeck, selectedDeck }) => {
  const [decks, setDecks] = useState<TarotDeck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDecks = async () => {
      try {
        const data = await api.getDecks();
        setDecks(data);
      } catch (error) {
        console.error('Error loading decks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDecks();
  }, []);

  const handleDeckClick = async (deckId: string) => {
    try {
      const fullDeck = await api.getDeck(deckId);
      onSelectDeck(fullDeck);
    } catch (error) {
      console.error('Error loading deck:', error);
    }
  };

  if (isLoading) {
    return <div className="text-tarot-gold/80 text-sm">Cargando mazos...</div>;
  }

  return (
    <div className="deck-selector">
      <h2 className="text-xl sm:text-2xl font-bold text-tarot-gold mb-3 sm:mb-4">Selecciona un Mazo</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {decks.map(deck => (
          <button
            key={deck.id}
            onClick={() => handleDeckClick(deck.id)}
            className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
              selectedDeck?.id === deck.id
                ? 'border-tarot-gold bg-gradient-card shadow-mystic-lg'
                : 'border-tarot-gold/20 bg-tarot-navy/40 hover:border-tarot-gold/50 hover:shadow-mystic'
            }`}
          >
            <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">{deck.name}</h3>
            <p className="text-xs sm:text-sm text-tarot-silver/70 line-clamp-2">{deck.description}</p>
            <p className="text-xs text-tarot-gold/80 mt-2">{deck.cardCount} cartas</p>
          </button>
        ))}
      </div>
    </div>
  );
};
