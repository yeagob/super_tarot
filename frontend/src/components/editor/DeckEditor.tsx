import React, { useState } from 'react';
import { editorApi, DeckFull } from '../../services/editorApi';
import { TarotCard } from '../../types';

interface DeckEditorProps {
  deck: DeckFull;
  onBack: () => void;
  onEditCard: (card: TarotCard) => void;
  onCreateCard: () => void;
  onDeckUpdated: () => void;
}

export const DeckEditor: React.FC<DeckEditorProps> = ({
  deck,
  onBack,
  onEditCard,
  onCreateCard,
  onDeckUpdated
}) => {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [name, setName] = useState(deck.name);
  const [description, setDescription] = useState(deck.description);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveInfo = async () => {
    setIsSaving(true);
    try {
      await editorApi.updateDeck(deck.id, { name, description });
      setIsEditingInfo(false);
      onDeckUpdated();
    } catch (err) {
      alert('Error al guardar la información del mazo');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCard = async (card: TarotCard) => {
    const confirmed = window.confirm(
      `¿Eliminar la carta "${card.name}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      await editorApi.deleteCard(deck.id, card.id);
      onDeckUpdated();
    } catch (err) {
      alert('Error al eliminar la carta');
      console.error(err);
    }
  };

  return (
    <div>
      {/* Header con breadcrumb */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-tarot-gold hover:text-tarot-accent transition-colors duration-300 flex items-center gap-2 mb-4"
        >
          <span>←</span>
          <span>Volver a lista de mazos</span>
        </button>
        <h2 className="text-3xl font-bold text-tarot-gold">{deck.name}</h2>
        <p className="text-tarot-silver/70 text-sm mt-1">
          {deck.cards.length} cartas • {deck.id}
        </p>
      </div>

      {/* Información del mazo */}
      <div className="mb-8 bg-gradient-to-br from-tarot-navy/60 to-tarot-purple/30 border-2 border-tarot-gold/30 rounded-xl p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-tarot-gold">Información del Mazo</h3>
          {!isEditingInfo ? (
            <button
              onClick={() => setIsEditingInfo(true)}
              className="px-3 py-1 bg-tarot-accent/80 hover:bg-tarot-accent text-white font-semibold rounded-lg transition-all duration-300 text-sm"
            >
              ✏️ Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditingInfo(false)}
                disabled={isSaving}
                className="px-3 py-1 bg-tarot-silver/20 hover:bg-tarot-silver/30 text-white font-semibold rounded-lg transition-all duration-300 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveInfo}
                disabled={isSaving}
                className="px-3 py-1 bg-green-600/80 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-300 text-sm"
              >
                {isSaving ? 'Guardando...' : '💾 Guardar'}
              </button>
            </div>
          )}
        </div>

        {!isEditingInfo ? (
          <div className="space-y-3">
            <div>
              <label className="block text-tarot-silver/60 text-xs font-semibold mb-1">NOMBRE</label>
              <p className="text-white">{deck.name}</p>
            </div>
            <div>
              <label className="block text-tarot-silver/60 text-xs font-semibold mb-1">DESCRIPCIÓN</label>
              <p className="text-white">{deck.description || 'Sin descripción'}</p>
            </div>
            <div>
              <label className="block text-tarot-silver/60 text-xs font-semibold mb-1">ID</label>
              <p className="text-white font-mono text-sm">{deck.id}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-tarot-silver/80 text-sm font-semibold mb-2">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-tarot-dark/50 border border-tarot-gold/30 rounded-lg text-white focus:border-tarot-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-tarot-silver/80 text-sm font-semibold mb-2">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-tarot-dark/50 border border-tarot-gold/30 rounded-lg text-white focus:border-tarot-gold focus:outline-none resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Lista de cartas */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-tarot-gold">
            Cartas ({deck.cards.length})
          </h3>
          <button
            onClick={onCreateCard}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-lg transition-all duration-300 shadow-mystic flex items-center gap-2"
          >
            <span>➕</span>
            <span>Añadir Carta</span>
          </button>
        </div>

        {deck.cards.length === 0 ? (
          <div className="text-center py-12 bg-tarot-navy/30 rounded-xl border-2 border-dashed border-tarot-gold/20">
            <div className="text-6xl mb-4">🎴</div>
            <p className="text-tarot-silver/60 text-lg">Este mazo no tiene cartas</p>
            <p className="text-tarot-silver/40 text-sm mt-2">Haz clic en "Añadir Carta" para crear la primera</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deck.cards.map((card) => (
              <div
                key={card.id}
                className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-tarot-gold/20 rounded-lg p-4 hover:border-tarot-gold/50 transition-all duration-300"
              >
                <div className="mb-3">
                  <h4 className="text-lg font-bold text-tarot-gold mb-1">{card.name}</h4>
                  <p className="text-xs text-tarot-silver/60 mb-2">{card.id}</p>
                  <p className="text-sm text-gray-300 line-clamp-2">{card.description}</p>
                </div>

                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {card.keywords.slice(0, 3).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-tarot-accent/30 text-tarot-accent px-2 py-1 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                    {card.keywords.length > 3 && (
                      <span className="text-xs text-tarot-silver/60 px-2 py-1">
                        +{card.keywords.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onEditCard(card)}
                    className="flex-1 px-3 py-1.5 bg-tarot-gold/80 hover:bg-tarot-gold text-tarot-dark font-semibold rounded-lg transition-all duration-300 text-sm"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDeleteCard(card)}
                    className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-300 text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
