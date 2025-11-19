import React from 'react';

interface ReadingDisplayProps {
  reading: string | null;
  isLoading: boolean;
  onGenerate: () => void;
  canGenerate: boolean;
}

export const ReadingDisplay: React.FC<ReadingDisplayProps> = ({
  reading,
  isLoading,
  onGenerate,
  canGenerate
}) => {
  return (
    <div className="reading-display">
      <div className="mb-4">
        <button
          onClick={onGenerate}
          disabled={!canGenerate || isLoading}
          className="w-full px-6 py-4 bg-gradient-to-r from-tarot-gold to-yellow-500 hover:from-yellow-500 hover:to-tarot-gold text-tarot-dark font-bold text-lg rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-hover"
        >
          {isLoading ? '🔮 Interpretando...' : '🔮 Leer la Tirada'}
        </button>
      </div>

      {!canGenerate && (
        <div className="p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
          <p className="text-yellow-300 text-sm">
            ⚠️ Coloca al menos una carta en el tapete para generar una lectura.
          </p>
        </div>
      )}

      {reading && (
        <div className="mt-4 p-6 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-2 border-tarot-gold rounded-lg animate-fade-in">
          <h3 className="text-2xl font-bold text-tarot-gold mb-4 flex items-center gap-2">
            <span>✨</span>
            <span>Interpretación de tu Tirada</span>
            <span>✨</span>
          </h3>
          <div className="prose prose-invert max-w-none">
            {reading.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-200 mb-3 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-tarot-gold/30 text-center">
            <p className="text-sm text-gray-400 italic">
              Generado por IA • {new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
