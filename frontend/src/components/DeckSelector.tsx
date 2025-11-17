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
    return <div className="text-tarot-gold">Cargando mazos...</div>;
  }

  return (
    <div className="deck-selector">
      <h2 className="text-2xl font-bold text-tarot-gold mb-4">Selecciona un Mazo</h2>
      <div className="grid grid-cols-2 gap-4">
        {decks.map(deck => (
          <button
            key={deck.id}
            onClick={() => handleDeckClick(deck.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedDeck?.id === deck.id
                ? 'border-tarot-gold bg-tarot-purple/50 glow'
                : 'border-purple-400/30 bg-purple-900/20 hover:border-tarot-gold/50'
            }`}
          >
            <h3 className="text-lg font-semibold text-white mb-2">{deck.name}</h3>
            <p className="text-sm text-gray-300">{deck.description}</p>
            <p className="text-xs text-tarot-gold mt-2">{deck.cardCount} cartas</p>
          </button>
        ))}
      </div>
    </div>
  );
};
