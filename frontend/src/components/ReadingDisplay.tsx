import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ReadingDisplayProps {
  reading: string | null;
  isLoading: boolean;
  onGenerate: () => void;
  canGenerate: boolean;
  tableRef?: React.RefObject<HTMLDivElement>;
}

export const ReadingDisplay: React.FC<ReadingDisplayProps> = ({
  reading,
  isLoading,
  onGenerate,
  canGenerate,
  tableRef
}) => {
  const readingRef = useRef<HTMLDivElement>(null);

  // Parsear la lectura en secciones
  const parseReading = (text: string) => {
    const sections: { [key: string]: string } = {};

    const sectionMarkers = [
      'A. EXPLICACIÓN DE CADA CARTA',
      'B. LECTURA INTEGRADA DE LA TIRADA',
      'C. AFIRMACIÓN',
      'D. SUGERENCIA DE CANCIÓN',
      'E. ALTAR - ELEMENTO SIMBÓLICO',
      'F. MOVIMIENTO SIMBÓLICO',
      'G. VISUALIZACIÓN',
      'H. TAPPING',
      'I. ACTITUD PARA EL DÍA',
      'J. RECUERDA AGRADECER'
    ];

    let currentSection = '';
    let currentContent = '';

    const lines = text.split('\n');

    for (const line of lines) {
      const matchedSection = sectionMarkers.find(marker =>
        line.includes(marker) || line.includes(marker.replace('##', '').trim())
      );

      if (matchedSection) {
        if (currentSection) {
          sections[currentSection] = currentContent.trim();
        }
        currentSection = matchedSection;
        currentContent = '';
      } else {
        currentContent += line + '\n';
      }
    }

    if (currentSection) {
      sections[currentSection] = currentContent.trim();
    }

    return sections;
  };

  // Exportar a PDF
  const handleExportPDF = async () => {
    if (!readingRef.current) return;

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Título
      pdf.setFontSize(20);
      pdf.setTextColor(201, 169, 110); // Tarot gold elegante
      pdf.text('🌙 Lectura de Tarot 🌙', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Fecha
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      const fecha = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      pdf.text(fecha, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Capturar imagen de la tirada si existe
      if (tableRef?.current) {
        const tableCanvas = await html2canvas(tableRef.current, {
          backgroundColor: '#1a0033',
          scale: 2
        });
        const tableImgData = tableCanvas.toDataURL('image/png');
        const imgWidth = pageWidth - 20;
        const imgHeight = (tableCanvas.height * imgWidth) / tableCanvas.width;

        if (yPosition + imgHeight > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.addImage(tableImgData, 'PNG', 10, yPosition, imgWidth, Math.min(imgHeight, 100));
        yPosition += Math.min(imgHeight, 100) + 10;
      }

      // Contenido de la lectura
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);

      const sections = parseReading(reading || '');
      const margin = 15;
      const maxWidth = pageWidth - (margin * 2);

      for (const [title, content] of Object.entries(sections)) {
        // Título de sección
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.setTextColor(74, 20, 140);
        const titleText = title.replace(/^[A-J]\.\s*/, '').replace('##', '').trim();
        pdf.text(titleText, margin, yPosition);
        yPosition += 8;

        // Contenido de sección
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(60, 60, 60);

        const lines = pdf.splitTextToSize(content, maxWidth);
        for (const line of lines) {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(line, margin, yPosition);
          yPosition += 5;
        }
        yPosition += 5;
      }

      // Guardar PDF
      pdf.save(`lectura-tarot-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF');
    }
  };

  // Compartir por Email
  const handleShareEmail = () => {
    const subject = encodeURIComponent('Mi Lectura de Tarot');
    const body = encodeURIComponent(
      `Lectura de Tarot - ${new Date().toLocaleDateString('es-ES')}\n\n${reading || ''}\n\nGenerado por Super Tarot`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Compartir por WhatsApp
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🌙 *Lectura de Tarot* 🌙\n\n${reading || ''}\n\n_Generado por Super Tarot_`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Copiar al portapapeles
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(reading || '');
      alert('✅ Lectura copiada al portapapeles');
    } catch (error) {
      console.error('Error copiando:', error);
      alert('Error al copiar la lectura');
    }
  };

  const sections = reading ? parseReading(reading) : {};

  return (
    <div className="reading-display">
      <div className="mb-3 sm:mb-4">
        <button
          onClick={onGenerate}
          disabled={!canGenerate || isLoading}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-tarot-gold to-mystic-bronze hover:from-mystic-bronze hover:to-tarot-gold text-tarot-dark font-bold text-base sm:text-lg rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-mystic hover:shadow-mystic-lg"
        >
          {isLoading ? '🔮 Interpretando...' : '🔮 Leer la Tirada'}
        </button>
      </div>

      {!canGenerate && (
        <div className="p-3 sm:p-4 bg-tarot-gold/10 border border-tarot-gold/30 rounded-xl">
          <p className="text-tarot-gold/90 text-xs sm:text-sm">
            ⚠️ Coloca al menos una carta en el tapete y revélala para generar una lectura.
          </p>
        </div>
      )}

      {reading && (
        <div ref={readingRef} className="mt-3 sm:mt-4 animate-fade-in">
          {/* Botones de exportación */}
          <div className="mb-3 sm:mb-4 grid grid-cols-2 sm:flex gap-2">
            <button
              onClick={handleExportPDF}
              className="px-3 py-2 bg-mystic-bronze/80 hover:bg-mystic-bronze text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              title="Descargar como PDF"
            >
              <span>📄</span>
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button
              onClick={handleShareEmail}
              className="px-3 py-2 bg-mystic-blue/80 hover:bg-mystic-blue text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              title="Compartir por Email"
            >
              <span>📧</span>
              <span className="hidden sm:inline">Email</span>
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-2 bg-mystic-teal/80 hover:bg-mystic-teal text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              title="Compartir por WhatsApp"
            >
              <span>💬</span>
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              onClick={handleCopyToClipboard}
              className="px-3 py-2 bg-tarot-accent/80 hover:bg-tarot-accent text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              title="Copiar al portapapeles"
            >
              <span>📋</span>
              <span className="hidden sm:inline">Copiar</span>
            </button>
          </div>

          {/* Contenido de la lectura */}
          <div className="p-4 sm:p-6 bg-gradient-card border-2 border-tarot-gold/20 rounded-xl shadow-mystic-lg">
            <h3 className="text-2xl sm:text-3xl font-bold text-tarot-gold mb-4 sm:mb-6 text-center flex items-center justify-center gap-2 sm:gap-3">
              <span>✨</span>
              <span>Tu Lectura de Tarot</span>
              <span>✨</span>
            </h3>

            <div className="space-y-6">
              {Object.entries(sections).map(([title, content], index) => {
                const cleanTitle = title.replace(/^[A-J]\.\s*/, '').replace('##', '').trim();
                const icon = ['🎴', '📖', '💫', '🎵', '🕯️', '💃', '🧘', '👆', '🌅', '🙏'][index] || '✨';

                return (
                  <div key={title} className="bg-black/20 rounded-lg p-4 border border-tarot-gold/20">
                    <h4 className="text-xl font-bold text-tarot-gold mb-3 flex items-center gap-2">
                      <span>{icon}</span>
                      <span>{cleanTitle}</span>
                    </h4>
                    <div className="prose prose-invert max-w-none">
                      {content.split('\n').map((paragraph, pIndex) => (
                        paragraph.trim() && (
                          <p key={pIndex} className="text-gray-200 mb-2 leading-relaxed">
                            {paragraph}
                          </p>
                        )
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-tarot-gold/30 text-center">
              <p className="text-sm text-gray-400 italic">
                Generado con amor por IA • {new Date().toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Super Tarot - Conectando con tu sabiduría interior
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
