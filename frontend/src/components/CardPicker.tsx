import React, { useState, useMemo } from 'react';
import { TarotCard } from '../types';

interface CardPickerProps {
  cards: TarotCard[];
  deckName: string;
  onSelectCard: (card: TarotCard) => void;
  onClose: () => void;
  excludedCardIds?: string[];
}

export const CardPicker: React.FC<CardPickerProps> = ({
  cards,
  deckName,
  onSelectCard,
  onClose,
  excludedCardIds = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter available cards (not already drawn)
  const availableCards = useMemo(() => {
    return cards.filter(card => !excludedCardIds.includes(card.id));
  }, [cards, excludedCardIds]);

  // Filter by search term
  const filteredCards = useMemo(() => {
    if (!searchTerm.trim()) {
      return availableCards;
    }

    const search = searchTerm.toLowerCase();
    return availableCards.filter(card =>
      card.name.toLowerCase().includes(search) ||
      card.description.toLowerCase().includes(search) ||
      card.keywords.some(k => k.toLowerCase().includes(search))
    );
  }, [availableCards, searchTerm]);

  const handleSelectCard = (card: TarotCard) => {
    onSelectCard(card);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-tarot-navy to-tarot-purple border-2 border-tarot-gold/50 rounded-xl max-w-4xl w-full max-h-[80vh] shadow-mystic-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-tarot-gold/30">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-2xl font-bold text-tarot-gold">Elegir Carta Específica</h3>
              <p className="text-tarot-silver/70 text-sm mt-1">
                {deckName} • {availableCards.length} cartas disponibles
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-tarot-silver/60 hover:text-tarot-gold transition-colors text-3xl leading-none"
            >
              ✕
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-tarot-silver/50">
              🔍
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, descripción o palabra clave..."
              className="w-full pl-12 pr-4 py-3 bg-tarot-dark/50 border border-tarot-gold/30 rounded-lg text-white placeholder-tarot-silver/40 focus:border-tarot-gold focus:outline-none"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-tarot-silver/50 hover:text-tarot-gold transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Card List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredCards.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-tarot-silver/60 text-lg">
                {searchTerm ? 'No se encontraron cartas' : 'No hay cartas disponibles'}
              </p>
              {searchTerm && (
                <p className="text-tarot-silver/40 text-sm mt-2">
                  Intenta con otros términos de búsqueda
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleSelectCard(card)}
                  className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-tarot-gold/20 rounded-lg p-4 hover:border-tarot-gold hover:shadow-mystic transition-all duration-300 text-left group"
                >
                  {/* Card Name */}
                  <h4 className="text-lg font-bold text-tarot-gold mb-2 group-hover:scale-105 transition-transform">
                    {card.name}
                  </h4>

                  {/* Card Description */}
                  <p className="text-sm text-gray-300 line-clamp-2 mb-3">
                    {card.description}
                  </p>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-1">
                    {card.keywords.slice(0, 4).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-tarot-accent/30 text-tarot-accent px-2 py-1 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                    {card.keywords.length > 4 && (
                      <span className="text-xs text-tarot-silver/60 px-2 py-1">
                        +{card.keywords.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Arcana Badge */}
                  <div className="mt-3 flex items-center gap-2 text-xs text-tarot-silver/60">
                    <span>
                      {card.arcana === 'major' ? '🌟 Arcano Mayor' : '🎴 Arcano Menor'}
                    </span>
                    {card.number !== undefined && card.number !== null && (
                      <span>• #{card.number}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-tarot-gold/30 bg-tarot-dark/30">
          <p className="text-xs text-tarot-silver/50 text-center">
            {filteredCards.length} de {availableCards.length} cartas mostradas
            {excludedCardIds.length > 0 && (
              <> • {excludedCardIds.length} cartas ya sacadas</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
