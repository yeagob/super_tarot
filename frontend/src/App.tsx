import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DeckSelector } from './components/DeckSelector';
import { SpreadSelector } from './components/SpreadSelector';
import { DeckDisplay } from './components/DeckDisplay';
import { Table } from './components/Table';
import { ReadingDisplay } from './components/ReadingDisplay';
import { Controls } from './components/Controls';
import { useTarotReading } from './hooks/useTarotReading';

function App() {
  const {
    selectedDeck,
    setSelectedDeck,
    selectedSpread,
    setSelectedSpread,
    placedCards,
    allowReversed,
    setAllowReversed,
    reading,
    isLoadingReading,
    addCard,
    moveCard,
    revealCard,
    flipCard,
    removeCard,
    clearTable,
    generateReading
  } = useTarotReading();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-tarot-dark via-purple-900 to-tarot-dark text-white">
        {/* Header */}
        <header className="border-b border-tarot-gold/30 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-4xl font-bold text-center text-tarot-gold mb-2">
              🌙 Super Tarot 🌙
            </h1>
            <p className="text-center text-gray-300">
              Lectura de Tarot con Inteligencia Artificial
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <aside className="col-span-12 lg:col-span-3 space-y-6">
              <DeckSelector
                selectedDeck={selectedDeck}
                onSelectDeck={setSelectedDeck}
              />

              {selectedDeck && (
                <>
                  <SpreadSelector
                    selectedSpread={selectedSpread}
                    onSelectSpread={setSelectedSpread}
                  />

                  <Controls
                    allowReversed={allowReversed}
                    onToggleReversed={setAllowReversed}
                    onClearTable={clearTable}
                    hasCards={placedCards.length > 0}
                  />
                </>
              )}
            </aside>

            {/* Center - Table */}
            <div className="col-span-12 lg:col-span-6">
              {selectedDeck ? (
                <Table
                  placedCards={placedCards}
                  spread={selectedSpread}
                  onCardDrop={addCard}
                  onCardMove={moveCard}
                  onReveal={revealCard}
                  onFlip={flipCard}
                  onRemove={removeCard}
                />
              ) : (
                <div className="h-[600px] flex items-center justify-center bg-purple-900/20 rounded-lg border-2 border-dashed border-purple-400/30">
                  <div className="text-center text-gray-400">
                    <div className="text-6xl mb-4">🔮</div>
                    <p className="text-xl">Selecciona un mazo para comenzar</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <aside className="col-span-12 lg:col-span-3 space-y-6">
              {selectedDeck && (
                <>
                  <DeckDisplay deck={selectedDeck} />

                  <ReadingDisplay
                    reading={reading}
                    isLoading={isLoadingReading}
                    onGenerate={generateReading}
                    canGenerate={placedCards.length > 0 && placedCards.some(c => c.isRevealed)}
                  />
                </>
              )}
            </aside>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-tarot-gold/30 bg-black/20 backdrop-blur-sm mt-12">
          <div className="container mx-auto px-4 py-6 text-center text-gray-400 text-sm">
            <p>Super Tarot © 2024 • Powered by Gemini AI</p>
            <p className="mt-2">
              Las lecturas de tarot son para entretenimiento y reflexión personal.
            </p>
          </div>
        </footer>
      </div>
    </DndProvider>
  );
}

export default App;
