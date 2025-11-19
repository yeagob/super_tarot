import React, { useState, useRef } from 'react';
import { api } from '../services/api';

interface PhotoReadingUploaderProps {
  onAnalysisComplete: (result: any) => void;
}

export const PhotoReadingUploader: React.FC<PhotoReadingUploaderProps> = ({
  onAnalysisComplete
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máx 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen es demasiado grande. Máximo 10MB');
      return;
    }

    setError(null);

    // Leer archivo como Data URL para preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Extraer solo el base64 (sin el prefijo "data:image/jpeg;base64,")
      const base64Data = selectedImage.split(',')[1];

      console.log('🔍 Analyzing photo...');
      const result = await api.analyzePhoto(base64Data);
      console.log('✅ Analysis complete:', result);

      onAnalysisComplete(result);
    } catch (err) {
      console.error('Error analyzing photo:', err);
      setError('Error al analizar la imagen. Por favor intenta de nuevo.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-gradient-to-br from-tarot-navy to-tarot-purple border-2 border-tarot-gold/30 rounded-xl p-6 shadow-mystic">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-tarot-gold mb-2 flex items-center gap-2">
          📸 Analizar Tirada desde Foto
        </h3>
        <p className="text-sm text-tarot-silver/70">
          Sube una foto de tu tirada de tarot real y obtén una lectura completa con IA
        </p>
      </div>

      {/* Input de archivo */}
      {!selectedImage && (
        <div className="mb-4">
          <label
            htmlFor="photo-upload"
            className="block w-full cursor-pointer"
          >
            <div className="border-2 border-dashed border-tarot-gold/40 rounded-lg p-8 hover:border-tarot-gold hover:bg-tarot-accent/5 transition-all duration-300 text-center">
              <div className="text-5xl mb-3">📷</div>
              <p className="text-tarot-silver font-semibold mb-1">
                Haz clic para seleccionar una imagen
              </p>
              <p className="text-xs text-tarot-silver/50">
                JPG, PNG, WEBP • Máx 10MB
              </p>
            </div>
          </label>
          <input
            ref={fileInputRef}
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Preview de imagen */}
      {selectedImage && (
        <div className="mb-4">
          <div className="relative rounded-lg overflow-hidden border-2 border-tarot-gold/30">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-auto max-h-96 object-contain bg-black/20"
            />
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
              title="Eliminar imagen"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
          <p className="text-sm text-red-300">⚠️ {error}</p>
        </div>
      )}

      {/* Botón de análisis */}
      {selectedImage && (
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full px-6 py-3 bg-gradient-to-r from-tarot-accent to-tarot-purple hover:from-tarot-purple hover:to-tarot-accent text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-mystic hover:shadow-mystic-lg"
        >
          {isAnalyzing ? (
            <>
              <span className="inline-block animate-spin mr-2">🌀</span>
              Analizando con IA...
            </>
          ) : (
            <>
              🔮 Analizar Tirada
            </>
          )}
        </button>
      )}

      {/* Info */}
      <div className="mt-4 p-3 bg-purple-900/30 rounded-lg border border-purple-400/30">
        <p className="text-xs text-gray-300">
          💡 <strong>Tip:</strong> Para mejores resultados, asegúrate de que todas las cartas sean visibles y estén bien iluminadas. La IA detectará el mazo, las cartas y generará una lectura completa.
        </p>
      </div>
    </div>
  );
};
