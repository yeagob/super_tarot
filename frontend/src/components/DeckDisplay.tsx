import React, { useState } from 'react';
import { TarotDeck, TarotCard } from '../types';
import { DraggableCard } from './DraggableCard';
import { api } from '../services/api';

interface DeckDisplayProps {
  deck: TarotDeck;
}

export const DeckDisplay: React.FC<DeckDisplayProps> = ({ deck }) => {
  const [drawnCards, setDrawnCards] = useState<TarotCard[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleDrawCard = async () => {
    setIsDrawing(true);
    try {
      const cards = await api.shuffleDeck(deck.id, 1);
      setDrawnCards(prev => [...cards, ...prev].slice(0, 5)); // Keep last 5 drawn cards
    } catch (error) {
      console.error('Error drawing card:', error);
    } finally {
      setIsDrawing(false);
    }
  };

  return (
    <div className="deck-display">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-tarot-gold mb-2">{deck.name}</h3>
        <p className="text-sm text-gray-300 mb-3">{deck.description}</p>
        <button
          onClick={handleDrawCard}
          disabled={isDrawing}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-hover"
        >
          {isDrawing ? '🌀 Barajando...' : '🎴 Sacar una Carta'}
        </button>
      </div>

      {drawnCards.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-tarot-gold mb-2">
            Cartas Disponibles (Arrastra al tapete)
          </h4>
          <div className="flex flex-wrap gap-3">
            {drawnCards.map((card, index) => (
              <div key={`${card.id}-${index}`} className="animate-fade-in">
                <DraggableCard card={card} deckId={deck.id} />
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
