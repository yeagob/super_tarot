import React, { useState, useEffect } from 'react';
import { TarotCard } from '../types';
import { api } from '../services/api';

interface CardProps {
  card: TarotCard;
  deckId: string;
  isRevealed: boolean;
  isReversed: boolean;
  isDragging?: boolean;
  onReveal?: () => void;
  onFlip?: () => void;
  onRemove?: () => void;
  onDownload?: () => void;
  showTooltip?: boolean;
}

export const Card: React.FC<CardProps> = ({
  card,
  deckId,
  isRevealed,
  isReversed,
  isDragging = false,
  onReveal,
  onFlip,
  onRemove,
  onDownload,
  showTooltip = true
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (isRevealed && !imageUrl) {
      api.getCardPlaceholder(deckId, card.id)
        .then(data => setImageUrl(data.imageUrl))
        .catch(err => console.error('Error loading card image:', err));
    }
  }, [isRevealed, card.id, deckId, imageUrl]);

  const cardStyle: React.CSSProperties = {
    width: '120px',
    height: '200px',
    transform: isReversed && isRevealed ? 'rotate(180deg)' : 'none',
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <div
        style={cardStyle}
        className={`rounded-lg border-2 border-tarot-gold shadow-lg transition-all ${
          isRevealed ? 'bg-white' : 'bg-gradient-to-br from-purple-900 to-indigo-900'
        } ${!isRevealed ? 'cursor-pointer' : ''}`}
        onClick={!isRevealed ? onReveal : undefined}
      >
        {!isRevealed ? (
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className="text-center">
              <div className="text-4xl mb-2">🌙</div>
              <div className="text-xs text-tarot-gold font-semibold">Super Tarot</div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full p-2 overflow-hidden">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={card.name}
                className="w-full h-full object-cover rounded"
              />
            )}
          </div>
        )}
      </div>

      {isRevealed && (
        <div className="absolute -bottom-8 left-0 right-0 flex gap-1 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {onFlip && (
            <button
              onClick={onFlip}
              className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded"
              title="Voltear carta"
            >
              🔄
            </button>
          )}
          {onRemove && (
            <button
              onClick={onRemove}
              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
              title="Quitar carta"
            >
              ✕
            </button>
          )}
          {onDownload && (
            <button
              onClick={onDownload}
              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
              title="Descargar carta"
            >
              ⬇
            </button>
          )}
        </div>
      )}

      {showTooltip && showDetails && isRevealed && (
        <div className="absolute z-50 left-full ml-2 top-0 w-64 bg-gray-900 border-2 border-tarot-gold rounded-lg p-3 shadow-xl">
          <h3 className="text-lg font-bold text-tarot-gold mb-2">{card.name}</h3>
          <p className="text-xs text-gray-300 mb-2">{card.description}</p>
          <div className="text-xs">
            <p className="text-green-400 mb-1">
              <strong>Derecha:</strong> {card.uprightMeaning}
            </p>
            <p className="text-red-400">
              <strong>Invertida:</strong> {card.reversedMeaning}
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {card.keywords.map((keyword, idx) => (
              <span key={idx} className="text-xs bg-purple-700 px-2 py-1 rounded">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
