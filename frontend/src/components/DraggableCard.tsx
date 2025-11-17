import React from 'react';
import { useDrag } from 'react-dnd';
import { Card } from './Card';
import { TarotCard, DragItem } from '../types';

interface DraggableCardProps {
  card: TarotCard;
  deckId: string;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({ card, deckId }) => {
  const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>(() => ({
    type: 'CARD',
    item: { type: 'CARD', card, deckId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }), [card, deckId]);

  return (
    <div ref={drag} className="cursor-grab active:cursor-grabbing">
      <Card
        card={card}
        deckId={deckId}
        isRevealed={false}
        isReversed={false}
        isDragging={isDragging}
        showTooltip={false}
      />
    </div>
  );
};
