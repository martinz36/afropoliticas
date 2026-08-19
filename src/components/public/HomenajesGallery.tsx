'use client';

import { useState } from 'react';
import { Award, Sparkles, X } from 'lucide-react';
import { SelectTribute } from '@/db/schema';
import { CldImageWrapper } from './CldImageWrapper';

interface HomenajesGalleryProps {
  tributes: SelectTribute[];
}

export function HomenajesGallery({ tributes }: HomenajesGalleryProps) {
  const [selectedTribute, setSelectedTribute] = useState<SelectTribute | null>(null);

  // Convierte HTML a texto plano simple para extractos
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '');
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header Banner Spotlight */}
      <div className="relative text-center space-y-4 max-w-4xl mx-auto pt-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Galería Cultural y Memoria</span>
        </div>

        <h1 className="text-3xl sm:text-6xl font-black text-slate-100 tracking-tight leading-tight">
          Homenajes y{' '}
          <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
            Reconocimientos
          </span>
        </h1>

        <p className="text-slate-400 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
          Un espacio de exaltación y tributo permanente a las personalidades, figuras históricas y líderes que han trazado el camino del legado afropolitano.
        </p>
      </div>

      {/* Gallery Grid Layout (Mobile First: 1 col on mobile, 2 col on tablet, 3-4 col on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tributes.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto text-xl">
              🏆
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">
              Aún no hay homenajes registrados en la galería.
            </p>
          </div>
        ) : (
          tributes.map((tribute) => (
            <div
              key={tribute.id}
              onClick={() => setSelectedTribute(tribute)}
              className="group relative rounded-2xl overflow-hidden bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 shadow-2xl transition-all hover:-translate-y-1.5 cursor-pointer flex flex-col justify-end min-h-[380px]"
            >
              {/* Cloudinary Background Image */}
              <div className="absolute inset-0 bg-slate-950">
                <CldImageWrapper
                  src={tribute.imageUrl || ''}
                  alt={tribute.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-90"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              </div>

              {/* Card Content Overlay */}
              <div className="relative z-10 p-6 space-y-3">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Homenaje</span>
                </div>

                <h3 className="text-2xl font-black text-slate-100 group-hover:text-amber-300 transition-colors leading-snug">
                  {tribute.name}
                </h3>

                {tribute.description && (
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed opacity-90">
                    {stripHtml(tribute.description)}
                  </p>
                )}

                <div className="pt-2 flex items-center text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>Conocer homenaje →</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tribute Detail Modal */}
      {selectedTribute && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedTribute(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Spotlight Image Header */}
            {selectedTribute.imageUrl && (
              <div className="relative w-full h-72 sm:h-96 rounded-xl overflow-hidden border border-amber-500/20 shadow-xl">
                <CldImageWrapper
                  src={selectedTribute.imageUrl}
                  alt={selectedTribute.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              </div>
            )}

            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Reconocimiento Cultural</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-100 leading-tight">
                {selectedTribute.name}
              </h2>

              {selectedTribute.description ? (
                <div
                  className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed border-t border-slate-800 pt-4"
                  dangerouslySetInnerHTML={{ __html: selectedTribute.description }}
                />
              ) : (
                <p className="text-slate-500 italic text-xs border-t border-slate-800 pt-4">
                  Sin descripción registrada.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
