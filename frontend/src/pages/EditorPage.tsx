import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { editorApi, DeckSummary, DeckFull } from '../services/editorApi';
import { DeckList } from '../components/editor/DeckList';
import { DeckEditor } from '../components/editor/DeckEditor';
import { CardEditor } from '../components/editor/CardEditor';
import { TarotCard } from '../types';

type EditorView = 'list' | 'deck-edit' | 'card-edit' | 'card-create';

export const EditorPage: React.FC = () => {
  const [view, setView] = useState<EditorView>('list');
  const [decks, setDecks] = useState<DeckSummary[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<DeckFull | null>(null);
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar lista de mazos
  const loadDecks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await editorApi.listDecks();
      setDecks(data);
    } catch (err) {
      setError('Error al cargar los mazos');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar mazo completo
  const loadDeck = async (deckId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const deck = await editorApi.getDeck(deckId);
      setSelectedDeck(deck);
      setView('deck-edit');
    } catch (err) {
      setError('Error al cargar el mazo');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDecks();
  }, []);

  const handleBack = () => {
    setView('list');
    setSelectedDeck(null);
    setSelectedCard(null);
    loadDecks();
  };

  const handleEditCard = (card: TarotCard) => {
    setSelectedCard(card);
    setView('card-edit');
  };

  const handleCreateCard = () => {
    setSelectedCard(null);
    setView('card-create');
  };

  const handleCardSaved = async () => {
    if (selectedDeck) {
      await loadDeck(selectedDeck.id);
    }
    setView('deck-edit');
  };

  return (
    <div className="min-h-screen bg-gradient-mystic text-white">
      {/* Header con navegación */}
      <header className="border-b border-tarot-gold/20 bg-tarot-navy/40 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-tarot-gold mb-1">
                🛠️ Editor de Mazos
              </h1>
              <p className="text-tarot-silver/80 text-sm sm:text-base">
                Control total sobre tus tarots
              </p>
            </div>
            <Link
              to="/"
              className="px-4 py-2 bg-tarot-accent/80 hover:bg-tarot-accent text-white font-semibold rounded-lg transition-all duration-300"
            >
              🏠 Volver a la App
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg">
            <p className="text-red-200">⚠️ {error}</p>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tarot-gold"></div>
          </div>
        )}

        {!isLoading && view === 'list' && (
          <DeckList
            decks={decks}
            onSelectDeck={loadDeck}
            onRefresh={loadDecks}
          />
        )}

        {!isLoading && view === 'deck-edit' && selectedDeck && (
          <DeckEditor
            deck={selectedDeck}
            onBack={handleBack}
            onEditCard={handleEditCard}
            onCreateCard={handleCreateCard}
            onDeckUpdated={loadDecks}
          />
        )}

        {!isLoading && (view === 'card-edit' || view === 'card-create') && selectedDeck && (
          <CardEditor
            deckId={selectedDeck.id}
            card={selectedCard}
            onBack={() => setView('deck-edit')}
            onSaved={handleCardSaved}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-tarot-gold/10 bg-tarot-navy/30 backdrop-blur-md mt-8 sm:mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-tarot-silver/60 text-xs sm:text-sm">
          <p>Editor de Mazos • Super Tarot © 2024</p>
          <p className="mt-2">
            Todos los cambios se guardan automáticamente
          </p>
        </div>
      </footer>
    </div>
  );
};
