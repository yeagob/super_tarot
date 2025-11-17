import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useDrop } from 'react-dnd';
import { PlacedCard, DragItem, Spread, TarotCard } from '../types';
import { Card } from './Card';
import html2canvas from 'html2canvas';

interface TableProps {
  placedCards: PlacedCard[];
  spread: Spread | null;
  onCardDrop: (card: TarotCard, deckId: string, x: number, y: number, positionId?: string) => void;
  onCardMove: (cardId: string, x: number, y: number, positionId?: string) => void;
  onReveal: (cardId: string) => void;
  onFlip: (cardId: string) => void;
  onRemove: (cardId: string) => void;
}

export const Table = forwardRef<HTMLDivElement, TableProps>(({
  placedCards,
  spread,
  onCardDrop,
  onCardMove,
  onReveal,
  onFlip,
  onRemove
}, ref) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);

  // Exponer el ref interno al ref externo
  useImperativeHandle(ref, () => tableRef.current as HTMLDivElement);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: (item: DragItem, monitor) => {
      if (!tableRef.current) return;

      const offset = monitor.getClientOffset();
      if (!offset) return;

      const tableRect = tableRef.current.getBoundingClientRect();
      const x = offset.x - tableRect.left;
      const y = offset.y - tableRect.top;

      // Check if dropped on a position
      let targetPositionId: string | undefined;
      if (spread) {
        const snapDistance = 60;
        for (const position of spread.positions) {
          const distance = Math.sqrt(
            Math.pow(x - position.x, 2) + Math.pow(y - position.y, 2)
          );
          if (distance < snapDistance) {
            targetPositionId = position.id;
            break;
          }
        }
      }

      if (item.placedCardId) {
        // Moving existing card
        const finalX = targetPositionId
          ? spread!.positions.find(p => p.id === targetPositionId)!.x
          : x;
        const finalY = targetPositionId
          ? spread!.positions.find(p => p.id === targetPositionId)!.y
          : y;
        onCardMove(item.placedCardId, finalX, finalY, targetPositionId);
      } else {
        // Adding new card
        const finalX = targetPositionId
          ? spread!.positions.find(p => p.id === targetPositionId)!.x
          : x;
        const finalY = targetPositionId
          ? spread!.positions.find(p => p.id === targetPositionId)!.y
          : y;
        onCardDrop(item.card, item.deckId, finalX, finalY, targetPositionId);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }), [spread, onCardDrop, onCardMove]);

  const handleExportImage = async () => {
    if (!tableRef.current) return;

    try {
      const canvas = await html2canvas(tableRef.current, {
        backgroundColor: '#1a0033',
        scale: 2
      });

      const link = document.createElement('a');
      link.download = `tarot-reading-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error exporting image:', error);
      alert('Error al exportar la imagen');
    }
  };

  const handleDownloadCard = async (card: PlacedCard) => {
    if (!card.imageUrl) return;

    try {
      const link = document.createElement('a');
      link.download = `${card.card?.name || card.cardId}.png`;
      link.href = card.imageUrl;
      link.click();
    } catch (error) {
      console.error('Error downloading card:', error);
    }
  };

  const handleCardDragStart = (cardId: string) => {
    setDraggedCardId(cardId);
  };

  const handleCardDragEnd = () => {
    setDraggedCardId(null);
  };

  return (
    <div className="relative">
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleExportImage}
          className="px-4 py-2 bg-tarot-gold text-tarot-dark font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
        >
          📸 Exportar Tirada
        </button>
      </div>

      <div
        ref={(node) => {
          tableRef.current = node;
          drop(node);
        }}
        className={`relative w-full h-[600px] bg-gradient-to-br from-green-900/20 to-green-800/20 rounded-lg border-4 ${
          isOver ? 'border-tarot-gold glow' : 'border-tarot-gold/30'
        } overflow-hidden`}
      >
        {/* Spread positions */}
        {spread && spread.positions.map(position => {
          const isOccupied = placedCards.some(c => c.positionId === position.id);
          return (
            <div
              key={position.id}
              className={`absolute w-[120px] h-[200px] border-2 border-dashed rounded-lg transition-all ${
                isOccupied
                  ? 'border-green-500/30'
                  : 'border-yellow-400/50 hover:border-yellow-400'
              }`}
              style={{
                left: position.x - 60,
                top: position.y - 100
              }}
            >
              <div className="absolute -top-6 left-0 right-0 text-center text-xs text-tarot-gold font-semibold">
                {position.name}
              </div>
            </div>
          );
        })}

        {/* Placed cards */}
        {placedCards.map((placedCard) => (
          <PlacedCardWrapper
            key={placedCard.cardId}
            placedCard={placedCard}
            onDragStart={handleCardDragStart}
            onDragEnd={handleCardDragEnd}
            onReveal={() => onReveal(placedCard.cardId)}
            onFlip={() => onFlip(placedCard.cardId)}
            onRemove={() => onRemove(placedCard.cardId)}
            onDownload={() => handleDownloadCard(placedCard)}
            isDragging={draggedCardId === placedCard.cardId}
          />
        ))}

        {placedCards.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg">
            <div className="text-center">
              <div className="text-6xl mb-4">🃏</div>
              <p>Arrastra cartas aquí para comenzar tu tirada</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface PlacedCardWrapperProps {
  placedCard: PlacedCard;
  onDragStart: (cardId: string) => void;
  onDragEnd: () => void;
  onReveal: () => void;
  onFlip: () => void;
  onRemove: () => void;
  onDownload: () => void;
  isDragging: boolean;
}

const PlacedCardWrapper: React.FC<PlacedCardWrapperProps> = ({
  placedCard,
  onDragStart,
  onDragEnd,
  onReveal,
  onFlip,
  onRemove,
  onDownload,
  isDragging
}) => {
  const [{ isDraggingThis }, drag] = useDrag<DragItem & { placedCardId: string }, unknown, { isDraggingThis: boolean }>(
    () => ({
      type: 'CARD',
      item: {
        type: 'CARD',
        card: placedCard.card!,
        deckId: placedCard.deckId,
        placedCardId: placedCard.cardId
      },
      collect: (monitor) => ({
        isDraggingThis: monitor.isDragging()
      })
    }),
    [placedCard]
  );

  React.useEffect(() => {
    if (isDraggingThis) {
      onDragStart(placedCard.cardId);
    } else {
      onDragEnd();
    }
  }, [isDraggingThis, placedCard.cardId, onDragStart, onDragEnd]);

  if (!placedCard.card) return null;

  return (
    <div
      ref={drag}
      className="absolute cursor-move"
      style={{
        left: placedCard.x - 60,
        top: placedCard.y - 100,
        opacity: isDraggingThis ? 0.5 : 1
      }}
    >
      <Card
        card={placedCard.card}
        deckId={placedCard.deckId}
        isRevealed={placedCard.isRevealed}
        isReversed={placedCard.isReversed}
        onReveal={onReveal}
        onFlip={onFlip}
        onRemove={onRemove}
        onDownload={onDownload}
      />
    </div>
  );
};
