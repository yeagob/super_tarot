import React, { useState } from 'react';
import { editorApi, DeckSummary } from '../../services/editorApi';

interface DeckListProps {
  decks: DeckSummary[];
  onSelectDeck: (deckId: string) => void;
  onRefresh: () => void;
}

export const DeckList: React.FC<DeckListProps> = ({ decks, onSelectDeck, onRefresh }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDeckId, setNewDeckId] = useState('');
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newDeckId || !newDeckName) {
      setCreateError('ID y nombre son obligatorios');
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      await editorApi.createDeck({
        id: newDeckId,
        name: newDeckName,
        description: newDeckDescription
      });
      setShowCreateModal(false);
      setNewDeckId('');
      setNewDeckName('');
      setNewDeckDescription('');
      onRefresh();
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDuplicate = async (deck: DeckSummary) => {
    const newId = prompt(`Nuevo ID para la copia de "${deck.name}":`, `${deck.id}-copy`);
    if (!newId) return;

    const newName = prompt('Nuevo nombre:', `${deck.name} (Copia)`);
    if (!newName) return;

    try {
      await editorApi.duplicateDeck(deck.id, { newId, newName });
      onRefresh();
    } catch (err: any) {
      alert(`Error al duplicar: ${err.message}`);
    }
  };

  const handleDelete = async (deck: DeckSummary) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar "${deck.name}"?\n\n` +
      `Este mazo tiene ${deck.cardCount} cartas.\n` +
      `Se creará un backup automáticamente.`
    );

    if (!confirmed) return;

    try {
      const result = await editorApi.deleteDeck(deck.id);
      alert(`✅ Mazo eliminado. Backup creado en:\n${result.backup}`);
      onRefresh();
    } catch (err: any) {
      alert(`Error al eliminar: ${err.message}`);
    }
  };

  return (
    <div>
      {/* Header con botón crear */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-tarot-gold">Mazos Disponibles</h2>
          <p className="text-tarot-silver/70 text-sm mt-1">
            {decks.length} mazos • {decks.reduce((sum, d) => sum + d.cardCount, 0)} cartas totales
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-lg transition-all duration-300 shadow-mystic flex items-center gap-2"
        >
          <span>➕</span>
          <span>Crear Nuevo Mazo</span>
        </button>
      </div>

      {/* Grid de mazos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {decks.map(deck => (
          <div
            key={deck.id}
            className="bg-gradient-to-br from-tarot-navy/60 to-tarot-purple/30 border-2 border-tarot-gold/30 rounded-xl p-6 hover:border-tarot-gold/60 transition-all duration-300 shadow-mystic hover:shadow-mystic-lg"
          >
            {/* Nombre y descripción */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-tarot-gold mb-2">{deck.name}</h3>
              <p className="text-tarot-silver/70 text-sm line-clamp-2 mb-3">
                {deck.description || 'Sin descripción'}
              </p>
              <div className="flex items-center gap-4 text-xs text-tarot-silver/60">
                <span>🎴 {deck.cardCount} cartas</span>
                <span>📄 {deck.fileName}</span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSelectDeck(deck.id)}
                className="px-3 py-2 bg-tarot-gold/80 hover:bg-tarot-gold text-tarot-dark font-semibold rounded-lg transition-all duration-300 text-sm"
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => handleDuplicate(deck)}
                className="px-3 py-2 bg-tarot-accent/80 hover:bg-tarot-accent text-white font-semibold rounded-lg transition-all duration-300 text-sm"
              >
                📋 Duplicar
              </button>
              <button
                onClick={() => handleDelete(deck)}
                className="col-span-2 px-3 py-2 bg-red-600/80 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-300 text-sm"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {decks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-tarot-silver/60 text-lg">No hay mazos disponibles</p>
          <p className="text-tarot-silver/40 text-sm mt-2">Crea tu primer mazo para comenzar</p>
        </div>
      )}

      {/* Modal de creación */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-tarot-navy to-tarot-purple border-2 border-tarot-gold/50 rounded-xl p-6 max-w-md w-full shadow-mystic-lg">
            <h3 className="text-2xl font-bold text-tarot-gold mb-4">Crear Nuevo Mazo</h3>

            {createError && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-sm">
                ⚠️ {createError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-tarot-silver/80 text-sm font-semibold mb-2">
                  ID del Mazo *
                </label>
                <input
                  type="text"
                  value={newDeckId}
                  onChange={(e) => setNewDeckId(e.target.value)}
                  placeholder="tarot-mi-mazo"
                  className="w-full px-4 py-2 bg-tarot-dark/50 border border-tarot-gold/30 rounded-lg text-white placeholder-tarot-silver/40 focus:border-tarot-gold focus:outline-none"
                />
                <p className="text-xs text-tarot-silver/50 mt-1">
                  Debe comenzar con "tarot-" y solo contener minúsculas, números y guiones
                </p>
              </div>

              <div>
                <label className="block text-tarot-silver/80 text-sm font-semibold mb-2">
                  Nombre del Mazo *
                </label>
                <input
                  type="text"
                  value={newDeckName}
                  onChange={(e) => setNewDeckName(e.target.value)}
                  placeholder="Mi Tarot Personalizado"
                  className="w-full px-4 py-2 bg-tarot-dark/50 border border-tarot-gold/30 rounded-lg text-white placeholder-tarot-silver/40 focus:border-tarot-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-tarot-silver/80 text-sm font-semibold mb-2">
                  Descripción
                </label>
                <textarea
                  value={newDeckDescription}
                  onChange={(e) => setNewDeckDescription(e.target.value)}
                  placeholder="Descripción del mazo..."
                  rows={3}
                  className="w-full px-4 py-2 bg-tarot-dark/50 border border-tarot-gold/30 rounded-lg text-white placeholder-tarot-silver/40 focus:border-tarot-gold focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                disabled={isCreating}
                className="flex-1 px-4 py-2 bg-tarot-silver/20 hover:bg-tarot-silver/30 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={isCreating}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50"
              >
                {isCreating ? 'Creando...' : 'Crear Mazo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
