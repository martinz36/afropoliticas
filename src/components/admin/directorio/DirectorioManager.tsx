'use client';

import { useState, useTransition } from 'react';
import {
  Users,
  Globe,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Filter,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import Image from 'next/image';
import { SelectCountry } from '@/db/schema';
import { ProfileWithCountry } from '@/actions/profile-actions';
import {
  createCountryAction,
  updateCountryAction,
  deleteCountryAction,
} from '@/actions/country-actions';
import {
  createProfileAction,
  updateProfileAction,
  deleteProfileAction,
} from '@/actions/profile-actions';
import { ImageUpload } from '@/components/ui/ImageUpload';

interface DirectorioManagerProps {
  initialCountries: SelectCountry[];
  initialProfiles: ProfileWithCountry[];
}

export function DirectorioManager({
  initialCountries,
  initialProfiles,
}: DirectorioManagerProps) {
  const [isPending, startTransition] = useTransition();

  // Active tab state: 'profiles' | 'countries'
  const [activeTab, setActiveTab] = useState<'profiles' | 'countries'>('profiles');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('all');

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  /* =========================================================================
     MODAL STATES - PROFILE
     ========================================================================= */
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<ProfileWithCountry | null>(null);
  const [profileName, setProfileName] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [profileCountryId, setProfileCountryId] = useState<string>('');

  const openCreateProfileModal = () => {
    setEditingProfile(null);
    setProfileName('');
    setProfileBio('');
    setProfileImageUrl('');
    setProfileCountryId('');
    setProfileModalOpen(true);
  };

  const openEditProfileModal = (profile: ProfileWithCountry) => {
    setEditingProfile(profile);
    setProfileName(profile.name);
    setProfileBio(profile.bio || '');
    setProfileImageUrl(profile.imageUrl || '');
    setProfileCountryId(profile.countryId ? String(profile.countryId) : '');
    setProfileModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        name: profileName,
        bio: profileBio,
        imageUrl: profileImageUrl,
        countryId: profileCountryId ? Number(profileCountryId) : null,
      };

      let res;
      if (editingProfile) {
        res = await updateProfileAction(editingProfile.id, payload);
      } else {
        res = await createProfileAction(payload);
      }

      if (res.success) {
        showToast('success', editingProfile ? 'Perfil actualizado correctamente.' : 'Perfil registrado correctamente.');
        setProfileModalOpen(false);
      } else {
        showToast('error', res.error || 'Ocurrió un error al guardar el perfil.');
      }
    });
  };

  /* =========================================================================
     MODAL STATES - COUNTRY
     ========================================================================= */
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<SelectCountry | null>(null);
  const [countryName, setCountryName] = useState('');

  const openCreateCountryModal = () => {
    setEditingCountry(null);
    setCountryName('');
    setCountryModalOpen(true);
  };

  const openEditCountryModal = (country: SelectCountry) => {
    setEditingCountry(country);
    setCountryName(country.name);
    setCountryModalOpen(true);
  };

  const handleSaveCountry = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      let res;
      if (editingCountry) {
        res = await updateCountryAction(editingCountry.id, countryName);
      } else {
        res = await createCountryAction(countryName);
      }

      if (res.success) {
        showToast('success', editingCountry ? 'País actualizado correctamente.' : 'País registrado correctamente.');
        setCountryModalOpen(false);
      } else {
        showToast('error', res.error || 'Ocurrió un error al guardar el país.');
      }
    });
  };

  /* =========================================================================
     DELETE CONFIRMATIONS
     ========================================================================= */
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'profile' | 'country'; id: number; name: string } | null>(null);

  const confirmDelete = () => {
    if (!deleteTarget) return;

    startTransition(async () => {
      let res;
      if (deleteTarget.type === 'profile') {
        res = await deleteProfileAction(deleteTarget.id);
      } else {
        res = await deleteCountryAction(deleteTarget.id);
      }

      if (res.success) {
        showToast('success', `${deleteTarget.type === 'profile' ? 'Perfil' : 'País'} eliminado.`);
        setDeleteTarget(null);
      } else {
        showToast('error', res.error || 'Error al eliminar el registro.');
      }
    });
  };

  /* =========================================================================
     FILTERED DATA
     ========================================================================= */
  const filteredProfiles = initialProfiles.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.bio && p.bio.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCountry =
      selectedCountryFilter === 'all' ||
      (p.countryId && String(p.countryId) === selectedCountryFilter);
    return matchesSearch && matchesCountry;
  });

  const filteredCountries = initialCountries.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Users className="w-4 h-4" />
            <span>Base de Datos — Directorio</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            {activeTab === 'profiles' ? 'Directorio de Perfiles' : 'Registro de Países'}
          </h2>
          <p className="text-xs text-slate-400">
            {activeTab === 'profiles'
              ? 'Administra los perfiles de investigadoras, personalidades e investigadoras.'
              : 'Administra la lista de países disponibles para clasificar los perfiles.'}
          </p>
        </div>

        <button
          onClick={activeTab === 'profiles' ? openCreateProfileModal : openCreateCountryModal}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{activeTab === 'profiles' ? 'Nuevo Perfil' : 'Nuevo País'}</span>
        </button>
      </div>

      {/* Tabs & Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('profiles')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'profiles'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Perfiles ({initialProfiles.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('countries')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'countries'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Países ({initialCountries.length})</span>
          </button>
        </div>

        {/* Search & Country Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Buscar en ${activeTab === 'profiles' ? 'perfiles' : 'países'}...`}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {activeTab === 'profiles' && (
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedCountryFilter}
                onChange={(e) => setSelectedCountryFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="all">Todos los países</option>
                {initialCountries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
         TAB 1: PROFILES TABLE
         ========================================================================= */}
      {activeTab === 'profiles' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Foto</th>
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">País</th>
                  <th className="px-6 py-4">Biografía</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredProfiles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No se encontraron perfiles registrados.
                    </td>
                  </tr>
                ) : (
                  filteredProfiles.map((profile) => (
                    <tr
                      key={profile.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Avatar */}
                      <td className="px-6 py-3">
                        {profile.imageUrl ? (
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                            <Image
                              src={profile.imageUrl}
                              alt={profile.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center font-bold">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </td>

                      {/* Name */}
                      <td className="px-6 py-3 font-bold text-slate-100">
                        {profile.name}
                      </td>

                      {/* Country Badge */}
                      <td className="px-6 py-3">
                        {profile.countryName ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold text-[11px]">
                            <Globe className="w-3 h-3 text-amber-400" />
                            <span>{profile.countryName}</span>
                          </span>
                        ) : (
                          <span className="text-slate-500 italic">No especificado</span>
                        )}
                      </td>

                      {/* Bio */}
                      <td className="px-6 py-3 text-slate-300 max-w-xs truncate">
                        {profile.bio || <span className="text-slate-600">Sin biografía</span>}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditProfileModal(profile)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                            title="Editar Perfil"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteTarget({ type: 'profile', id: profile.id, name: profile.name })
                            }
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all border border-rose-500/20"
                            title="Eliminar Perfil"
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
      )}

      {/* =========================================================================
         TAB 2: COUNTRIES TABLE
         ========================================================================= */}
      {activeTab === 'countries' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl max-w-3xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Nombre del País</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredCountries.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                      No se encontraron países registrados.
                    </td>
                  </tr>
                ) : (
                  filteredCountries.map((country) => (
                    <tr
                      key={country.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-3 font-mono text-slate-500">
                        #{country.id}
                      </td>
                      <td className="px-6 py-3 font-bold text-slate-100 flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-amber-400" />
                        <span>{country.name}</span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditCountryModal(country)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                            title="Editar País"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteTarget({ type: 'country', id: country.id, name: country.name })
                            }
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all border border-rose-500/20"
                            title="Eliminar País"
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
      )}

      {/* =========================================================================
         PROFILE MODAL (CREATE / EDIT)
         ========================================================================= */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl animate-fade-in relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-bold text-lg text-slate-100">
                {editingProfile ? 'Editar Perfil' : 'Registrar Nuevo Perfil'}
              </h3>
              <button
                onClick={() => setProfileModalOpen(false)}
                className="text-slate-400 hover:text-slate-100 p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Image Upload Component */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-slate-400">
                  Fotografía de Perfil (Cloudinary)
                </label>
                <ImageUpload
                  value={profileImageUrl}
                  onUpload={(url) => setProfileImageUrl(url)}
                  onRemove={() => setProfileImageUrl('')}
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-slate-400">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Ej. Ana María Zapata"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Country Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-slate-400">
                  País Asociado
                </label>
                <select
                  value={profileCountryId}
                  onChange={(e) => setProfileCountryId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="">Selecciona un país...</option>
                  {initialCountries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-slate-400">
                  Biografía
                </label>
                <textarea
                  rows={3}
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  placeholder="Escribe un resumen o semblanza..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end space-x-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
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
                  <span>{editingProfile ? 'Guardar Cambios' : 'Crear Perfil'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         COUNTRY MODAL (CREATE / EDIT)
         ========================================================================= */}
      {countryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl animate-fade-in relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-bold text-lg text-slate-100">
                {editingCountry ? 'Editar País' : 'Registrar Nuevo País'}
              </h3>
              <button
                onClick={() => setCountryModalOpen(false)}
                className="text-slate-400 hover:text-slate-100 p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCountry} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-slate-400">
                  Nombre del País *
                </label>
                <input
                  type="text"
                  required
                  value={countryName}
                  onChange={(e) => setCountryName(e.target.value)}
                  placeholder="Ej. Senegal, Colombia, Nigeria..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end space-x-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setCountryModalOpen(false)}
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
                  <span>{editingCountry ? 'Guardar Cambios' : 'Crear País'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         DELETE CONFIRMATION DIALOG
         ========================================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto text-xl">
              ⚠️
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-100 text-base">
                ¿Eliminar {deleteTarget.type === 'profile' ? 'Perfil' : 'País'}?
              </h3>
              <p className="text-xs text-slate-400">
                Estás a punto de eliminar a <strong className="text-slate-200">"{deleteTarget.name}"</strong>. Esta acción no se puede deshacer.
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
