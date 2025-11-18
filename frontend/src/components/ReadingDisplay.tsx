import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ReadingDisplayProps {
  reading: string | null;
  isLoading: boolean;
  onGenerate: () => void;
  canGenerate: boolean;
  tableRef?: React.RefObject<HTMLDivElement>;
}

interface Section {
  title: string;
  content: string;
  icon: string;
  gradient: string;
}

export const ReadingDisplay: React.FC<ReadingDisplayProps> = ({
  reading,
  isLoading,
  onGenerate,
  canGenerate,
  tableRef
}) => {
  const readingRef = useRef<HTMLDivElement>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['A']));

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
    setExpandedSections(new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  // Parsear la lectura en secciones
  const parseReading = (text: string): Section[] => {
    const sectionDefinitions = [
      { key: 'A', marker: 'A. EXPLICACIÓN DE CADA CARTA', icon: '🎴', gradient: 'from-purple-600/20 to-indigo-600/20' },
      { key: 'B', marker: 'B. LECTURA INTEGRADA DE LA TIRADA', icon: '📖', gradient: 'from-blue-600/20 to-cyan-600/20' },
      { key: 'C', marker: 'C. AFIRMACIÓN', icon: '💫', gradient: 'from-amber-600/20 to-yellow-600/20' },
      { key: 'D', marker: 'D. SUGERENCIA DE CANCIÓN', icon: '🎵', gradient: 'from-pink-600/20 to-rose-600/20' },
      { key: 'E', marker: 'E. ALTAR - ELEMENTO SIMBÓLICO', icon: '🕯️', gradient: 'from-orange-600/20 to-red-600/20' },
      { key: 'F', marker: 'F. MOVIMIENTO SIMBÓLICO', icon: '💃', gradient: 'from-teal-600/20 to-green-600/20' },
      { key: 'G', marker: 'G. VISUALIZACIÓN', icon: '🧘', gradient: 'from-violet-600/20 to-purple-600/20' },
      { key: 'H', marker: 'H. TAPPING', icon: '👆', gradient: 'from-sky-600/20 to-blue-600/20' },
      { key: 'I', marker: 'I. ACTITUD PARA EL DÍA', icon: '🌅', gradient: 'from-rose-600/20 to-pink-600/20' },
      { key: 'J', marker: 'J. RECUERDA AGRADECER', icon: '🙏', gradient: 'from-emerald-600/20 to-teal-600/20' }
    ];

    const sections: Section[] = [];
    let currentIndex = -1;
    let currentContent = '';

    const lines = text.split('\n');

    for (const line of lines) {
      const matchedDef = sectionDefinitions.find(def =>
        line.includes(def.marker) || line.includes(def.marker.replace('##', '').trim())
      );

      if (matchedDef) {
        if (currentIndex >= 0) {
          sections.push({
            title: sectionDefinitions[currentIndex].marker.replace(/^[A-J]\.\s*/, '').trim(),
            content: currentContent.trim(),
            icon: sectionDefinitions[currentIndex].icon,
            gradient: sectionDefinitions[currentIndex].gradient
          });
        }
        currentIndex = sectionDefinitions.indexOf(matchedDef);
        currentContent = '';
      } else {
        currentContent += line + '\n';
      }
    }

    if (currentIndex >= 0) {
      sections.push({
        title: sectionDefinitions[currentIndex].marker.replace(/^[A-J]\.\s*/, '').trim(),
        content: currentContent.trim(),
        icon: sectionDefinitions[currentIndex].icon,
        gradient: sectionDefinitions[currentIndex].gradient
      });
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

      // Capturar imagen de la tirada si existe (esperar a que cargue)
      if (tableRef?.current) {
        // Esperar 500ms para que las imágenes se carguen
        await new Promise(resolve => setTimeout(resolve, 500));

        const tableCanvas = await html2canvas(tableRef.current, {
          backgroundColor: '#1a0033',
          scale: 2,
          useCORS: true,
          allowTaint: true
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

      for (const section of sections) {
        // Título de sección
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.setTextColor(74, 20, 140);
        pdf.text(`${section.icon} ${section.title}`, margin, yPosition);
        yPosition += 8;

        // Contenido de sección
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(60, 60, 60);

        const lines = pdf.splitTextToSize(section.content, maxWidth);
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

  const sections = reading ? parseReading(reading) : [];

  return (
    <div className="reading-display w-full">
      <div className="mb-3 sm:mb-4">
        <button
          onClick={onGenerate}
          disabled={!canGenerate || isLoading}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-tarot-gold to-mystic-bronze hover:from-mystic-bronze hover:to-tarot-gold text-tarot-dark font-bold text-base sm:text-lg rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-mystic hover:shadow-mystic-lg"
        >
          {isLoading ? '🔮 Interpretando...' : '🔮 Leer la Tirada'}
        </button>
      </div>

      {!canGenerate && !reading && (
        <div className="p-3 sm:p-4 bg-tarot-gold/10 border border-tarot-gold/30 rounded-xl">
          <p className="text-tarot-gold/90 text-xs sm:text-sm">
            ⚠️ Coloca al menos una carta en el tapete y revélala para generar una lectura.
          </p>
        </div>
      )}

      {reading && (
        <div ref={readingRef} className="mt-6 sm:mt-8 animate-fade-in">
          {/* Título místico */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-block">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-tarot-gold via-tarot-accent to-tarot-gold mb-2 animate-pulse-slow">
                ✨ Tu Lectura de Tarot ✨
              </h2>
              <div className="h-1 bg-gradient-to-r from-transparent via-tarot-gold to-transparent rounded-full"></div>
            </div>
            <p className="mt-3 text-sm sm:text-base text-tarot-silver/80 italic">
              {new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="mb-6 flex flex-wrap gap-2 justify-center">
            <button
              onClick={expandAll}
              className="px-3 py-2 bg-tarot-accent/80 hover:bg-tarot-accent text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 text-sm"
            >
              <span>📂</span>
              <span>Expandir Todo</span>
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-2 bg-tarot-purple/80 hover:bg-tarot-purple text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 text-sm"
            >
              <span>📁</span>
              <span>Contraer Todo</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="px-3 py-2 bg-mystic-bronze/80 hover:bg-mystic-bronze text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 text-sm"
            >
              <span>📄</span>
              <span>Descargar PDF</span>
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-2 bg-mystic-teal/80 hover:bg-mystic-teal text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 text-sm"
            >
              <span>💬</span>
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleCopyToClipboard}
              className="px-3 py-2 bg-mystic-blue/80 hover:bg-mystic-blue text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 text-sm"
            >
              <span>📋</span>
              <span>Copiar</span>
            </button>
          </div>

          {/* Secciones colapsables */}
          <div className="space-y-3 sm:space-y-4">
            {sections.map((section, index) => {
              const sectionKey = String.fromCharCode(65 + index); // A, B, C...
              const isExpanded = expandedSections.has(sectionKey);

              return (
                <div
                  key={sectionKey}
                  className={`group bg-gradient-to-br ${section.gradient} backdrop-blur-sm border-2 border-tarot-gold/30 rounded-xl overflow-hidden transition-all duration-500 ${
                    isExpanded ? 'shadow-mystic-lg' : 'shadow-mystic hover:shadow-mystic-lg'
                  }`}
                >
                  {/* Header (siempre visible) */}
                  <button
                    onClick={() => toggleSection(sectionKey)}
                    className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors duration-300"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300">
                        {section.icon}
                      </div>
                      <div className="text-left">
                        <div className="text-xs sm:text-sm text-tarot-silver/60 font-semibold">
                          Sección {sectionKey}
                        </div>
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-tarot-gold group-hover:text-tarot-accent transition-colors duration-300">
                          {section.title}
                        </h3>
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl text-tarot-gold/80 transform transition-transform duration-300">
                      {isExpanded ? '▲' : '▼'}
                    </div>
                  </button>

                  {/* Contenido colapsable */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-4 sm:px-6 pb-5 sm:pb-6">
                      <div className="h-px bg-gradient-to-r from-transparent via-tarot-gold/30 to-transparent mb-4"></div>
                      <div className="prose prose-invert max-w-none">
                        {section.content.split('\n').map((paragraph, pIndex) => {
                          const trimmed = paragraph.trim();
                          if (!trimmed) return null;

                          // Detectar bullets/listas
                          if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
                            return (
                              <div key={pIndex} className="flex gap-3 mb-3 text-gray-200">
                                <span className="text-tarot-gold mt-1">✧</span>
                                <p className="leading-relaxed">{trimmed.substring(1).trim()}</p>
                              </div>
                            );
                          }

                          // Detectar headers (con **)
                          if (trimmed.includes('**')) {
                            const text = trimmed.replace(/\*\*/g, '');
                            return (
                              <h4 key={pIndex} className="text-tarot-accent font-bold text-lg mb-2 mt-4">
                                {text}
                              </h4>
                            );
                          }

                          return (
                            <p key={pIndex} className="text-gray-200 mb-3 leading-relaxed text-sm sm:text-base">
                              {trimmed}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer místico */}
          <div className="mt-8 sm:mt-10 p-6 bg-gradient-to-r from-tarot-dark/50 via-tarot-navy/50 to-tarot-dark/50 rounded-xl border border-tarot-gold/20 text-center">
            <p className="text-tarot-gold font-semibold mb-2 text-sm sm:text-base">
              🌙 Que la sabiduría del Tarot te guíe 🌙
            </p>
            <p className="text-xs sm:text-sm text-gray-400 italic">
              Generado con amor por IA • Super Tarot
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Conectando con tu sabiduría interior
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
