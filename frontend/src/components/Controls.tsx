import React from 'react';

interface ControlsProps {
  allowReversed: boolean;
  onToggleReversed: (value: boolean) => void;
  onClearTable: () => void;
  hasCards: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  allowReversed,
  onToggleReversed,
  onClearTable,
  hasCards
}) => {
  return (
    <div className="controls p-4 bg-purple-900/30 rounded-lg border border-purple-400/30">
      <h3 className="text-lg font-bold text-tarot-gold mb-3">Controles</h3>

      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={allowReversed}
            onChange={(e) => onToggleReversed(e.target.checked)}
            className="w-5 h-5 rounded border-2 border-tarot-gold bg-transparent checked:bg-tarot-gold cursor-pointer"
          />
          <span className="text-white group-hover:text-tarot-gold transition-colors">
            Permitir cartas invertidas
          </span>
        </label>

        <button
          onClick={onClearTable}
          disabled={!hasCards}
          className="w-full px-4 py-2 bg-gradient-to-r from-mystic-bronze to-mystic-teal hover:from-mystic-teal hover:to-mystic-bronze text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-mystic"
        >
          🔄 Nueva Tirada
        </button>
      </div>

      <div className="mt-4 p-3 bg-black/20 rounded text-xs text-gray-300 space-y-1">
        <p><strong>📌 Cómo usar:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Selecciona un mazo</li>
          <li>Saca cartas del mazo</li>
          <li>Arrastra las cartas al tapete</li>
          <li>Haz clic para revelar cartas</li>
          <li>Genera la lectura cuando estés listo</li>
        </ul>
      </div>
    </div>
  );
};
