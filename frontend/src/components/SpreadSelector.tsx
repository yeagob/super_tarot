import React, { useEffect, useState } from 'react';
import { Spread } from '../types';
import { api } from '../services/api';

interface SpreadSelectorProps {
  onSelectSpread: (spread: Spread | null) => void;
  selectedSpread: Spread | null;
}

export const SpreadSelector: React.FC<SpreadSelectorProps> = ({ onSelectSpread, selectedSpread }) => {
  const [spreads, setSpreads] = useState<Spread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSpreads = async () => {
      try {
        const data = await api.getSpreads();
        setSpreads(data);
      } catch (error) {
        console.error('Error loading spreads:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSpreads();
  }, []);

  if (isLoading) {
    return <div className="text-tarot-gold">Cargando tiradas...</div>;
  }

  return (
    <div className="spread-selector">
      <h2 className="text-xl font-bold text-tarot-gold mb-3">Tipo de Tirada</h2>
      <div className="space-y-2">
        <button
          onClick={() => onSelectSpread(null)}
          className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
            !selectedSpread
              ? 'border-tarot-gold bg-tarot-purple/50 glow'
              : 'border-purple-400/30 bg-purple-900/20 hover:border-tarot-gold/50'
          }`}
        >
          <h3 className="text-md font-semibold text-white">Tirada Libre</h3>
          <p className="text-xs text-gray-300">Coloca las cartas donde quieras</p>
        </button>
        {spreads.map(spread => (
          <button
            key={spread.id}
            onClick={() => onSelectSpread(spread)}
            className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
              selectedSpread?.id === spread.id
                ? 'border-tarot-gold bg-tarot-purple/50 glow'
                : 'border-purple-400/30 bg-purple-900/20 hover:border-tarot-gold/50'
            }`}
          >
            <h3 className="text-md font-semibold text-white">{spread.name}</h3>
            <p className="text-xs text-gray-300">{spread.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
