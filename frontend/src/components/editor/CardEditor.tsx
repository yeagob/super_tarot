import React, { useState, useEffect } from 'react';
import { editorApi } from '../../services/editorApi';
import { TarotCard } from '../../types';

interface CardEditorProps {
  deckId: string;
  card: TarotCard | null; // null = crear, TarotCard = editar
  onBack: () => void;
  onSaved: () => void;
}

export const CardEditor: React.FC<CardEditorProps> = ({ deckId, card, onBack, onSaved }) => {
  const isEditing = card !== null;

  const [formData, setFormData] = useState({
    id: card?.id || '',
    name: card?.name || '',
    description: card?.description || '',
    keywords: card?.keywords || [],
    uprightMeaning: card?.uprightMeaning || '',
    reversedMeaning: card?.reversedMeaning || '',
    arcana: (card?.arcana || 'major') as 'major' | 'minor',
    number: card?.number !== undefined ? card.number : undefined as number | undefined
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (card) {
      setFormData({
        id: card.id,
        name: card.name,
        description: card.description,
        keywords: card.keywords,
        uprightMeaning: card.uprightMeaning,
        reversedMeaning: card.reversedMeaning,
        arcana: card.arcana || 'major',
        number: card.number
      });
    }
  }, [card]);

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim()]
      });
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.id || !formData.name) {
      setError('ID y nombre son obligatorios');
      return;
    }

    setIsSaving(true);

    try {
      if (isEditing) {
        await editorApi.updateCard(deckId, formData.id, formData);
      } else {
        await editorApi.addCard(deckId, {
          ...formData,
          keywords: formData.keywords,
          number: formData.number
        });
      }
      onSaved();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-tarot-gold hover:text-tarot-accent transition-colors duration-300 flex items-center gap-2 mb-4"
        >
          <span>←</span>
          <span>Volver al mazo</span>
        </button>
        <h2 className="text-3xl font-bold text-tarot-gold">
          {isEditing ? `Editar: ${card.name}` : 'Crear Nueva Carta'}
        </h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200">
          ⚠️ {error}
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="bg-gradient-to-br from-tarot-navy/60 to-tarot-purple/30 border-2 border-tarot-gold/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-tarot-gold mb-4">Información Básica</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-tarot-silver/80 text-sm font-semibold mb-2">
                ID de la Carta *
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                disabled={isEditing}
                placeholder="carta-0"
                className="w-full px-4 py-2 bg-tarot-dark/50 border border-tarot-gold/30 rounded-lg text-white placeholder-tarot-silver/40 focus:border-tarot-gold focus:outline-none disabled:opacity-50"
              />
              <p className="text-xs text-tarot-silver/50 mt-1">
                {isEditing ? 'El ID no se puede modificar' : 'Identificador único de la carta'}
              </p>
            </div>

            <div>
              <label className="block text-tarot-silver/80 text-sm font-semibold mb-2">
                Nombre de la Carta *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="El Loco"
                className="w-full px-4 py-2 bg-tarot-dark/50 border border-tarot-gold/30 rounded-lg text-white placeholder-tarot-silver/40 focus:border-tarot-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-tarot-silver/80 text-sm font-semibold mb-2">
                Arcana
              </label>
              <select
                value={formData.arcana}
                onChange={(e) => setFormData({ ...formData, arcana: e.target.value as 'major' | 'minor' })}
                className="w-full px-4 py-2 bg-tarot-dark/50 border border-tarot-gold/30 rounded-lg text-white focus:border-tarot-gold focus:outline-none"
              >
                <option value="major">Arcano Mayor</option>
                <option value="minor">Arcano Menor</option>
              </select>
            </div>

            <div>
              <label className="block text-tarot-silver/80 text-sm font-semibold mb-2">
                Número
              </label>
              <input
                type="number"
                value={formData.number !== undefined ? formData.number : ''}
                onChange={(e) => setFormData({
                  ...formData,
                  number: e.target.value ? parseInt(e.target.value) : undefined
                })}
                placeholder="0"
                className="w-full px-4 py-2 bg-tarot-dark/50 border border-tarot-gold/30 rounded-lg text-white placeholder-tarot-silver/40 focus:border-tarot-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-tarot-silver/80 text-sm font-semibold mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción general de la carta..."
              rows={4}
              className="w-full px-4 py-2 bg-tarot-dark/50 border border-tarot-gold/30 rounded-lg text-white placeholder-tarot-silver/40 focus:border-tarot-gold focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Palabras clave */}
        <div className="bg-gradient-to-br from-tarot-navy/60 to-tarot-purple/30 border-2 border-tarot-gold/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-tarot-gold mb-4">Palabras Clave</h3>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
              placeholder="Añadir palabra clave..."
              className="flex-1 px-4 py-2 bg-tarot-dark/50 border border-tarot-gold/30 rounded-lg text-white placeholder-tarot-silver/40 focus:border-tarot-gold focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddKeyword}
              className="px-4 py-2 bg-tarot-accent/80 hover:bg-tarot-accent text-white font-semibold rounded-lg transition-all duration-300"
            >
              ➕ Añadir
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.keywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 bg-tarot-accent/30 text-tarot-accent px-3 py-1 rounded-lg"
              >
                <span>{keyword}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(index)}
                  className="hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </span>
            ))}
            {formData.keywords.length === 0 && (
              <p className="text-tarot-silver/50 text-sm">No hay palabras clave</p>
            )}
          </div>
        </div>

        {/* Significados */}
        <div className="bg-gradient-to-br from-tarot-navy/60 to-tarot-purple/30 border-2 border-tarot-gold/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-tarot-gold mb-4">Significados</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-tarot-silver/80 text-sm font-semibold mb-2">
                Significado Derecho (Normal)
              </label>
              <textarea
                value={formData.uprightMeaning}
                onChange={(e) => setFormData({ ...formData, uprightMeaning: e.target.value })}
                placeholder="Significado cuando la carta sale en posición normal..."
                rows={4}
                className="w-full px-4 py-2 bg-tarot-dark/50 border border-tarot-gold/30 rounded-lg text-white placeholder-tarot-silver/40 focus:border-tarot-gold focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-tarot-silver/80 text-sm font-semibold mb-2">
                Significado Invertido (Reverso)
              </label>
              <textarea
                value={formData.reversedMeaning}
                onChange={(e) => setFormData({ ...formData, reversedMeaning: e.target.value })}
                placeholder="Significado cuando la carta sale invertida..."
                rows={4}
                className="w-full px-4 py-2 bg-tarot-dark/50 border border-tarot-gold/30 rounded-lg text-white placeholder-tarot-silver/40 focus:border-tarot-gold focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isSaving}
            className="flex-1 px-6 py-3 bg-tarot-silver/20 hover:bg-tarot-silver/30 text-white font-semibold rounded-lg transition-all duration-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-lg transition-all duration-300 shadow-mystic disabled:opacity-50"
          >
            {isSaving ? 'Guardando...' : isEditing ? '💾 Guardar Cambios' : '✨ Crear Carta'}
          </button>
        </div>
      </form>
    </div>
  );
};
