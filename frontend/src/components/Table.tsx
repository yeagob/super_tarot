import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useDrop, useDrag } from 'react-dnd';
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
      // Esperar 1 segundo para que todas las imágenes se carguen completamente
      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = await html2canvas(tableRef.current, {
        backgroundColor: '#1a0033',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      const link = document.createElement('a');
      link.download = `tarot-reading-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error exporting image:', error);
      alert('Error al exportar la imagen. Asegúrate de que todas las cartas estén reveladas.');
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
      <div className="mb-3 sm:mb-4 flex justify-end">
        <button
          onClick={handleExportImage}
          className="px-3 sm:px-4 py-2 bg-tarot-gold/90 text-tarot-dark font-semibold rounded-lg hover:bg-tarot-gold shadow-mystic hover:shadow-mystic-lg transition-all duration-300 text-sm sm:text-base"
        >
          📸 Exportar Tirada
        </button>
      </div>

      <div
        ref={(node) => {
          tableRef.current = node;
          drop(node);
        }}
        className={`relative w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-gradient-to-br from-mystic-blue/30 to-mystic-teal/20 rounded-xl border-2 ${
          isOver ? 'border-tarot-gold shadow-glow-gold' : 'border-tarot-gold/20'
        } overflow-hidden transition-all duration-300 backdrop-blur-sm`}
      >
        {/* Spread positions */}
        {spread && spread.positions.map(position => {
          const isOccupied = placedCards.some(c => c.positionId === position.id);
          return (
            <div
              key={position.id}
              className={`absolute w-[100px] sm:w-[120px] h-[166px] sm:h-[200px] border-2 border-dashed rounded-lg transition-all duration-300 ${
                isOccupied
                  ? 'border-tarot-accent/30'
                  : 'border-tarot-gold/40 hover:border-tarot-gold/70'
              }`}
              style={{
                left: position.x - (window.innerWidth < 640 ? 50 : 60),
                top: position.y - (window.innerWidth < 640 ? 83 : 100)
              }}
            >
              <div className="absolute -top-5 sm:-top-6 left-0 right-0 text-center text-xs text-tarot-gold/90 font-medium">
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
          <div className="absolute inset-0 flex items-center justify-center text-tarot-silver/50 text-base sm:text-lg">
            <div className="text-center px-4">
              <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🃏</div>
              <p className="text-sm sm:text-base">Arrastra cartas aquí para comenzar tu tirada</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

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
        showDeckName={!placedCard.isRevealed}
      />
    </div>
  );
};
