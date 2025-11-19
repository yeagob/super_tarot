import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DeckSelector } from './components/DeckSelector';
import { SpreadSelector } from './components/SpreadSelector';
import { DeckDisplay } from './components/DeckDisplay';
import { Table } from './components/Table';
import { ReadingDisplay } from './components/ReadingDisplay';
import { PhotoReadingUploader } from './components/PhotoReadingUploader';
import { PhotoReadingDisplay } from './components/PhotoReadingDisplay';
import { Controls } from './components/Controls';
import { useTarotReading } from './hooks/useTarotReading';

function App() {
  const tableRef = useRef<HTMLDivElement>(null);
  const [photoAnalysisResult, setPhotoAnalysisResult] = useState<any>(null);

  const {
    selectedDeck,
    setSelectedDeck,
    selectedSpread,
    setSelectedSpread,
    placedCards,
    drawnCardIds,
    markCardAsDrawn,
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
      <div className="min-h-screen bg-gradient-mystic text-white">
        {/* Header */}
        <header className="border-b border-tarot-gold/20 bg-tarot-navy/40 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex justify-between items-center mb-2">
              <div className="flex-1"></div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-tarot-gold">
                🌙 Super Tarot
              </h1>
              <div className="flex-1 flex justify-end">
                <Link
                  to="/editor"
                  className="px-3 sm:px-4 py-2 bg-tarot-accent/80 hover:bg-tarot-accent text-white font-semibold rounded-lg transition-all duration-300 text-xs sm:text-sm flex items-center gap-2"
                >
                  <span>🛠️</span>
                  <span className="hidden sm:inline">Editor</span>
                </Link>
              </div>
            </div>
            <p className="text-center text-tarot-silver/80 text-sm sm:text-base">
              Lecturas Místicas con Inteligencia Artificial
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Left Sidebar */}
            <aside className="lg:col-span-3 space-y-4 sm:space-y-6">
              <DeckSelector
                selectedDeck={selectedDeck}
                onSelectDeck={setSelectedDeck}
              />

              {/* Analizador de Fotos */}
              <PhotoReadingUploader
                onAnalysisComplete={setPhotoAnalysisResult}
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

            {/* Center - Table y Lectura */}
            <div className="lg:col-span-6 order-first lg:order-none space-y-6 sm:space-y-8">
              {/* Tapete */}
              {selectedDeck ? (
                <Table
                  ref={tableRef}
                  placedCards={placedCards}
                  spread={selectedSpread}
                  onCardDrop={addCard}
                  onCardMove={moveCard}
                  onReveal={revealCard}
                  onFlip={flipCard}
                  onRemove={removeCard}
                />
              ) : (
                <div className="h-[400px] sm:h-[600px] flex items-center justify-center bg-tarot-navy/30 rounded-xl border-2 border-dashed border-tarot-gold/20">
                  <div className="text-center text-tarot-silver/60">
                    <div className="text-5xl sm:text-6xl mb-4">🔮</div>
                    <p className="text-lg sm:text-xl">Selecciona un mazo para comenzar</p>
                  </div>
                </div>
              )}

              {/* Lectura (debajo del tapete) */}
              {selectedDeck && (
                <ReadingDisplay
                  reading={reading}
                  isLoading={isLoadingReading}
                  onGenerate={generateReading}
                  canGenerate={placedCards.length > 0 && placedCards.some(c => c.isRevealed)}
                  tableRef={tableRef}
                />
              )}

              {/* Lectura desde Foto */}
              {photoAnalysisResult && (
                <PhotoReadingDisplay
                  result={photoAnalysisResult}
                  onClose={() => setPhotoAnalysisResult(null)}
                />
              )}
            </div>

            {/* Right Sidebar */}
            <aside className="lg:col-span-3 space-y-4 sm:space-y-6">
              {selectedDeck && (
                <DeckDisplay
                  deck={selectedDeck}
                  placedCardIds={placedCards.map(c => c.card?.id || c.cardId)}
                  drawnCardIds={drawnCardIds}
                  onMarkCardAsDrawn={markCardAsDrawn}
                />
              )}
            </aside>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-tarot-gold/10 bg-tarot-navy/30 backdrop-blur-md mt-8 sm:mt-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-tarot-silver/60 text-xs sm:text-sm">
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
