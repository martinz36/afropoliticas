'use client';

import { useState } from 'react';
import { Newspaper, Calendar, ExternalLink, ArrowRight, X } from 'lucide-react';
import { SelectPost } from '@/db/schema';
import { CldImageWrapper } from './CldImageWrapper';

interface NoticiasGridProps {
  posts: SelectPost[];
}

export function NoticiasGrid({ posts }: NoticiasGridProps) {
  const [selectedPost, setSelectedPost] = useState<SelectPost | null>(null);

  // Convierte HTML a texto plano simple para extractos
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
          <Newspaper className="w-3.5 h-3.5 text-amber-400" />
          <span>Publicaciones y Comunicados</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          Noticias Afropolitanas
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
          Mantente al día con los artículos, investigaciones y noticias más recientes de nuestra comunidad.
        </p>
      </div>

      {/* Grid Layout (Mobile First: 1 col mobile, 2 col tablet, 3 col desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto text-xl">
              📰
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">
              No hay publicaciones ni noticias disponibles en este momento.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-amber-500/50 transition-all hover:-translate-y-1 group cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Image Header with CldImageWrapper */}
                <div className="relative w-full h-52 bg-slate-950 overflow-hidden">
                  <CldImageWrapper
                    src={post.imageUrl || ''}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-300 font-mono text-[11px] flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Article Body */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {stripHtml(post.content)}
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs font-bold text-amber-400 border-t border-slate-800/60 mt-4">
                <span className="group-hover:underline">Leer más</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))
        )}
      </div>

      {/* Article Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Header */}
            {selectedPost.imageUrl && (
              <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-slate-800">
                <CldImageWrapper
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-xs text-amber-400 font-mono">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(selectedPost.createdAt).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 leading-snug">
                {selectedPost.title}
              </h2>

              {/* Rendered HTML Content */}
              <div
                className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed border-t border-slate-800 pt-4"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />

              {/* External Link if available */}
              {selectedPost.externalLink && (
                <div className="pt-4 border-t border-slate-800">
                  <a
                    href={selectedPost.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
                  >
                    <span>Visitar enlace externo</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
