'use client';

import { useState, useTransition } from 'react';
import {
  Newspaper,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';
import Image from 'next/image';
import { SelectPost } from '@/db/schema';
import {
  createPostAction,
  updatePostAction,
  deletePostAction,
} from '@/actions/post-actions';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { RichTextEditor } from '@/components/ui/RichTextEditor';

interface NoticiasManagerProps {
  initialPosts: SelectPost[];
}

export function NoticiasManager({ initialPosts }: NoticiasManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  /* =========================================================================
     MODAL STATES
     ========================================================================= */
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SelectPost | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [externalLink, setExternalLink] = useState('');

  const openCreateModal = () => {
    setEditingPost(null);
    setTitle('');
    setContent('');
    setImageUrl('');
    setExternalLink('');
    setModalOpen(true);
  };

  const openEditModal = (post: SelectPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setImageUrl(post.imageUrl || '');
    setExternalLink(post.externalLink || '');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        title,
        content,
        imageUrl,
        externalLink,
      };

      let res;
      if (editingPost) {
        res = await updatePostAction(editingPost.id, payload);
      } else {
        res = await createPostAction(payload);
      }

      if (res.success) {
        showToast('success', editingPost ? 'Noticia actualizada correctamente.' : 'Noticia publicada correctamente.');
        setModalOpen(false);
      } else {
        showToast('error', res.error || 'Ocurrió un error al guardar la noticia.');
      }
    });
  };

  /* =========================================================================
     DELETE CONFIRMATION
     ========================================================================= */
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);

  const confirmDelete = () => {
    if (!deleteTarget) return;

    startTransition(async () => {
      const res = await deletePostAction(deleteTarget.id);
      if (res.success) {
        showToast('success', 'Noticia eliminada correctamente.');
        setDeleteTarget(null);
      } else {
        showToast('error', res.error || 'Error al eliminar la noticia.');
      }
    });
  };

  /* Filtered posts */
  const filteredPosts = initialPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center space-x-3 text-xs font-semibold animate-fade-in ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
            <Newspaper className="w-4 h-4" />
            <span>Módulo de Publicaciones</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            Gestión de Noticias y Comunicados
          </h2>
          <p className="text-xs text-slate-400">
            Publica, edita y gestiona los artículos de noticias y novedades.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Noticia</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar noticias por título o contenido..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Imagen</th>
                <th className="px-6 py-4">Título</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Enlace</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No hay noticias publicadas.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Image */}
                    <td className="px-6 py-3">
                      {post.imageUrl ? (
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                          <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center font-bold">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </td>

                    {/* Title */}
                    <td className="px-6 py-3 font-bold text-slate-100 max-w-sm">
                      <p className="truncate">{post.title}</p>
                    </td>

                    {/* Created At */}
                    <td className="px-6 py-3 text-slate-400 font-mono text-[11px]">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-500/80" />
                        <span>
                          {new Date(post.createdAt).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </td>

                    {/* External Link */}
                    <td className="px-6 py-3">
                      {post.externalLink ? (
                        <a
                          href={post.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-amber-400 hover:underline text-[11px]"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span className="max-w-[120px] truncate">{post.externalLink}</span>
                        </a>
                      ) : (
                        <span className="text-slate-600 italic">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(post)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                          title="Editar Noticia"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteTarget({ id: post.id, title: post.title })
                          }
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all border border-rose-500/20"
                          title="Eliminar Noticia"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
         CREATE / EDIT MODAL
         ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-6 shadow-2xl animate-fade-in relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-bold text-lg text-slate-100">
                {editingPost ? 'Editar Noticia' : 'Crear Nueva Noticia'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-100 p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-slate-400">
                  Imagen Destacada (Cloudinary)
                </label>
                <ImageUpload
                  value={imageUrl}
                  onUpload={(url) => setImageUrl(url)}
                  onRemove={() => setImageUrl('')}
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-slate-400">
                  Título de la Noticia *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Encuentro Internacional sobre Afropolitica y Cultura..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Rich Text Content */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-slate-400">
                  Contenido Detallado (Editor Enriquecido) *
                </label>
                <RichTextEditor
                  value={content}
                  onChange={(newHtml) => setContent(newHtml)}
                />
              </div>

              {/* External Link */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-slate-400">
                  Enlace Externo / Referencia (Opcional)
                </label>
                <input
                  type="url"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  placeholder="https://ejemplo.org/noticia"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end space-x-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center space-x-2 disabled:opacity-50"
                >
                  {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingPost ? 'Guardar Cambios' : 'Publicar Noticia'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto text-xl">
              ⚠️
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-100 text-base">¿Eliminar Noticia?</h3>
              <p className="text-xs text-slate-400">
                Estás a punto de borrar <strong className="text-slate-200">"{deleteTarget.title}"</strong>. Esta acción no se puede revertir.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={isPending}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center space-x-2 disabled:opacity-50"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
