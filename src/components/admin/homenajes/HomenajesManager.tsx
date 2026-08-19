'use client';

import { useState, useTransition } from 'react';
import {
  Award,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';
import Image from 'next/image';
import { SelectTribute } from '@/db/schema';
import {
  createTributeAction,
  updateTributeAction,
  deleteTributeAction,
} from '@/actions/tribute-actions';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { RichTextEditor } from '@/components/ui/RichTextEditor';

interface HomenajesManagerProps {
  initialTributes: SelectTribute[];
}

export function HomenajesManager({ initialTributes }: HomenajesManagerProps) {
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
  const [editingTribute, setEditingTribute] = useState<SelectTribute | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const openCreateModal = () => {
    setEditingTribute(null);
    setName('');
    setDescription('');
    setImageUrl('');
    setModalOpen(true);
  };

  const openEditModal = (tribute: SelectTribute) => {
    setEditingTribute(tribute);
    setName(tribute.name);
    setDescription(tribute.description || '');
    setImageUrl(tribute.imageUrl || '');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        name,
        description,
        imageUrl,
      };

      let res;
      if (editingTribute) {
        res = await updateTributeAction(editingTribute.id, payload);
      } else {
        res = await createTributeAction(payload);
      }

      if (res.success) {
        showToast('success', editingTribute ? 'Homenaje actualizado correctamente.' : 'Homenaje registrado correctamente.');
        setModalOpen(false);
      } else {
        showToast('error', res.error || 'Ocurrió un error al guardar el homenaje.');
      }
    });
  };

  /* =========================================================================
     DELETE CONFIRMATION
     ========================================================================= */
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const confirmDelete = () => {
    if (!deleteTarget) return;

    startTransition(async () => {
      const res = await deleteTributeAction(deleteTarget.id);
      if (res.success) {
        showToast('success', 'Homenaje eliminado correctamente.');
        setDeleteTarget(null);
      } else {
        showToast('error', res.error || 'Error al eliminar el homenaje.');
      }
    });
  };

  /* Filtered tributes */
  const filteredTributes = initialTributes.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
            <Award className="w-4 h-4" />
            <span>Módulo Cultural</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            Homenajes y Reconocimientos
          </h2>
          <p className="text-xs text-slate-400">
            Registra y gestiona homenajes a personalidades y referentes afropolitanos.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Homenaje</span>
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
            placeholder="Buscar por nombre o descripción..."
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
                <th className="px-6 py-4">Homenajeado</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredTributes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No se han registrado homenajes.
                  </td>
                </tr>
              ) : (
                filteredTributes.map((tribute) => (
                  <tr
                    key={tribute.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Image */}
                    <td className="px-6 py-3">
                      {tribute.imageUrl ? (
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                          <Image
                            src={tribute.imageUrl}
                            alt={tribute.name}
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

                    {/* Name */}
                    <td className="px-6 py-3 font-bold text-slate-100">
                      {tribute.name}
                    </td>

                    {/* Created At */}
                    <td className="px-6 py-3 text-slate-400 font-mono text-[11px]">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-500/80" />
                        <span>
                          {new Date(tribute.createdAt).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(tribute)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                          title="Editar Homenaje"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteTarget({ id: tribute.id, name: tribute.name })
                          }
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all border border-rose-500/20"
                          title="Eliminar Homenaje"
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
                {editingTribute ? 'Editar Homenaje' : 'Crear Nuevo Homenaje'}
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
                  Fotografía de Homenaje (Cloudinary)
                </label>
                <ImageUpload
                  value={imageUrl}
                  onUpload={(url) => setImageUrl(url)}
                  onRemove={() => setImageUrl('')}
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-slate-400">
                  Nombre del Homenajeado *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Manuel Zapata Olivella, Frantz Fanon..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Rich Text Description */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-slate-400">
                  Reseña / Descripción (Editor Enriquecido)
                </label>
                <RichTextEditor
                  value={description}
                  onChange={(newHtml) => setDescription(newHtml)}
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
                  <span>{editingTribute ? 'Guardar Cambios' : 'Registrar Homenaje'}</span>
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
              <h3 className="font-bold text-slate-100 text-base">¿Eliminar Homenaje?</h3>
              <p className="text-xs text-slate-400">
                Estás a punto de borrar el homenaje a <strong className="text-slate-200">"{deleteTarget.name}"</strong>. Esta acción no se puede deshacer.
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
