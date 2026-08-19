'use client';

import { useState } from 'react';
import { Users, Globe, Search, Filter, X } from 'lucide-react';
import { SelectCountry } from '@/db/schema';
import { ProfileWithCountry } from '@/actions/profile-actions';
import { CldImageWrapper } from './CldImageWrapper';

interface DirectorioClientProps {
  countries: SelectCountry[];
  profiles: ProfileWithCountry[];
}

export function DirectorioClient({
  countries,
  profiles,
}: DirectorioClientProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Profile detail modal
  const [activeProfile, setActiveProfile] = useState<ProfileWithCountry | null>(null);

  // Filtering profiles by search and selected country
  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.bio && p.bio.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCountry =
      selectedCountry === 'all' ||
      (p.countryId && String(p.countryId) === selectedCountry);
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span>Directorio de Investigadoras y Liderazgos</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          Directorio de Perfiles
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
          Filtra y explora los perfiles por país de origen para conocer sus biografías y trayectoria.
        </p>
      </div>

      {/* Filter and Search Bar (Mobile First) */}
      <div className="bg-slate-900/80 p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o biografía..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Mobile Country Dropdown Filter */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="all">Todos los países ({profiles.length})</option>
              {countries.map((c) => {
                const count = profiles.filter((p) => p.countryId === c.id).length;
                return (
                  <option key={c.id} value={c.id}>
                    {c.name} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Horizontal Country Pills (Desktop & Tablet) */}
        <div className="hidden sm:flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setSelectedCountry('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCountry === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Todos ({profiles.length})
          </button>
          {countries.map((c) => {
            const count = profiles.filter((p) => p.countryId === c.id).length;
            const isSelected = selectedCountry === String(c.id);

            return (
              <button
                key={c.id}
                onClick={() => setSelectedCountry(String(c.id))}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{c.name}</span>
                <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Cards Grid (Mobile First: 1 col on mobile, 2 on tablet, 3-4 on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProfiles.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto text-xl">
              🔍
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">
              No se encontraron perfiles para el filtro seleccionado.
            </p>
          </div>
        ) : (
          filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => setActiveProfile(profile)}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-amber-500/50 transition-all hover:-translate-y-1 group cursor-pointer flex flex-col justify-between"
            >
              {/* Profile Image with CldImageWrapper */}
              <div className="relative w-full h-56 bg-slate-950 overflow-hidden">
                <CldImageWrapper
                  src={profile.imageUrl || ''}
                  alt={profile.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Country Badge */}
                {profile.countryName && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-amber-300 font-semibold text-[11px] flex items-center space-x-1">
                    <Globe className="w-3 h-3 text-amber-400" />
                    <span>{profile.countryName}</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-100 text-lg group-hover:text-amber-300 transition-colors">
                    {profile.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {profile.bio || 'Sin biografía disponible.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-400">
                  <span>Ver semblanza completa</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Profile Detail Modal */}
      {activeProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveProfile(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-amber-500/30 shrink-0 shadow-xl">
                <CldImageWrapper
                  src={activeProfile.imageUrl || ''}
                  alt={activeProfile.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                {activeProfile.countryName && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold text-xs">
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    <span>{activeProfile.countryName}</span>
                  </span>
                )}
                <h2 className="text-2xl font-bold text-slate-100">
                  {activeProfile.name}
                </h2>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-800 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Biografía y Trayectoria
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {activeProfile.bio || 'No hay biografía registrada para este perfil.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
