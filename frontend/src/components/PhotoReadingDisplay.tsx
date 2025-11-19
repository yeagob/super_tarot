import React, { useState } from 'react';

interface DetectedCard {
  position: number;
  name: string;
  orientation: 'upright' | 'reversed';
  confidence: 'high' | 'medium' | 'low';
}

interface PhotoReadingResult {
  detectedDeck: string;
  deckConfidence: 'high' | 'medium' | 'low';
  cards: DetectedCard[];
  reading: string;
  timestamp: string;
}

interface PhotoReadingDisplayProps {
  result: PhotoReadingResult;
  onClose: () => void;
}

export const PhotoReadingDisplay: React.FC<PhotoReadingDisplayProps> = ({
  result,
  onClose
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['detection', 'A'])
  );

  const toggleSection = (key: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedSections(new Set(['detection', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  // Parsear las secciones de la lectura
  const sections = [
    { key: 'A', marker: '## A. EXPLICACIÓN DE CADA CARTA', icon: '🎴', gradient: 'from-purple-600/20 to-indigo-600/20' },
    { key: 'B', marker: '## B. LECTURA INTEGRADA DE LA TIRADA', icon: '📖', gradient: 'from-blue-600/20 to-cyan-600/20' },
    { key: 'C', marker: '## C. AFIRMACIÓN', icon: '✨', gradient: 'from-cyan-600/20 to-teal-600/20' },
    { key: 'D', marker: '## D. SUGERENCIA DE CANCIÓN', icon: '🎵', gradient: 'from-teal-600/20 to-green-600/20' },
    { key: 'E', marker: '## E. ALTAR - ELEMENTO SIMBÓLICO', icon: '🕯️', gradient: 'from-green-600/20 to-lime-600/20' },
    { key: 'F', marker: '## F. MOVIMIENTO SIMBÓLICO', icon: '💃', gradient: 'from-lime-600/20 to-yellow-600/20' },
    { key: 'G', marker: '## G. VISUALIZACIÓN', icon: '🧘', gradient: 'from-yellow-600/20 to-orange-600/20' },
    { key: 'H', marker: '## H. TAPPING', icon: '👆', gradient: 'from-orange-600/20 to-red-600/20' },
    { key: 'I', marker: '## I. ACTITUD PARA EL DÍA', icon: '☀️', gradient: 'from-red-600/20 to-pink-600/20' },
    { key: 'J', marker: '## J. RECUERDA AGRADECER', icon: '🙏', gradient: 'from-pink-600/20 to-purple-600/20' }
  ];

  const parsedSections = sections.map(section => {
    const startIdx = result.reading.indexOf(section.marker);
    if (startIdx === -1) return { ...section, content: '' };

    const nextSectionIdx = sections
      .slice(sections.indexOf(section) + 1)
      .map(s => result.reading.indexOf(s.marker))
      .find(idx => idx > startIdx);

    const content = result.reading.substring(
      startIdx + section.marker.length,
      nextSectionIdx ?? result.reading.length
    ).trim();

    return { ...section, content };
  });

  const getConfidenceBadge = (confidence: 'high' | 'medium' | 'low') => {
    const styles = {
      high: 'bg-green-900/30 text-green-300 border-green-500/30',
      medium: 'bg-yellow-900/30 text-yellow-300 border-yellow-500/30',
      low: 'bg-red-900/30 text-red-300 border-red-500/30'
    };
    const labels = {
      high: 'Alta',
      medium: 'Media',
      low: 'Baja'
    };
    return (
      <span className={`text-xs px-2 py-1 rounded border ${styles[confidence]}`}>
        {labels[confidence]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-tarot-navy to-tarot-purple border-2 border-tarot-gold/50 rounded-xl p-6 shadow-mystic">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-tarot-gold mb-2">
              📸 Lectura desde Foto
            </h2>
            <p className="text-sm text-tarot-silver/70">
              {new Date(result.timestamp).toLocaleString('es-ES')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-tarot-silver/60 hover:text-tarot-gold transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Controles */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={expandAll}
            className="px-3 py-1 text-xs bg-tarot-accent/20 hover:bg-tarot-accent/30 text-tarot-accent rounded transition-colors"
          >
            Expandir Todo
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1 text-xs bg-tarot-silver/20 hover:bg-tarot-silver/30 text-tarot-silver rounded transition-colors"
          >
            Colapsar Todo
          </button>
        </div>
      </div>

      {/* Sección de Detección */}
      <div className="bg-gradient-to-br from-tarot-navy to-tarot-purple border-2 border-tarot-gold/30 rounded-xl overflow-hidden shadow-mystic">
        <button
          onClick={() => toggleSection('detection')}
          className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl group-hover:scale-110 transition-transform">🔍</div>
            <h3 className="text-lg font-bold text-tarot-gold">Cartas Detectadas</h3>
          </div>
          <div className="text-tarot-gold text-xl">
            {expandedSections.has('detection') ? '▲' : '▼'}
          </div>
        </button>

        <div className={`overflow-hidden transition-all duration-500 ${
          expandedSections.has('detection') ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="p-6 pt-2 space-y-4">
            {/* Mazo detectado */}
            <div className="bg-tarot-dark/30 rounded-lg p-4 border border-tarot-gold/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-tarot-gold">Mazo Identificado</h4>
                {getConfidenceBadge(result.deckConfidence)}
              </div>
              <p className="text-tarot-silver">{result.detectedDeck}</p>
            </div>

            {/* Cartas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.cards.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-tarot-dark/30 rounded-lg p-4 border border-purple-400/20"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-tarot-accent">
                        #{card.position}
                      </span>
                      <h5 className="font-semibold text-white">{card.name}</h5>
                    </div>
                    {getConfidenceBadge(card.confidence)}
                  </div>
                  <p className="text-sm text-tarot-silver/70">
                    {card.orientation === 'upright' ? '⬆️ Normal' : '⬇️ Invertida'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Secciones de la lectura */}
      {parsedSections.map(section => {
        if (!section.content) return null;

        const isExpanded = expandedSections.has(section.key);

        return (
          <div
            key={section.key}
            className="bg-gradient-to-br from-tarot-navy to-tarot-purple border-2 border-tarot-gold/30 rounded-xl overflow-hidden shadow-mystic"
          >
            <button
              onClick={() => toggleSection(section.key)}
              className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                  {section.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-tarot-gold text-left">
                  {section.marker.replace('## ', '')}
                </h3>
              </div>
              <div className="text-tarot-gold text-xl">
                {isExpanded ? '▲' : '▼'}
              </div>
            </button>

            <div className={`overflow-hidden transition-all duration-500 ${
              isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className={`p-6 pt-2 bg-gradient-to-br ${section.gradient}`}>
                <div className="prose prose-invert max-w-none">
                  <div className="text-sm sm:text-base text-gray-200 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
