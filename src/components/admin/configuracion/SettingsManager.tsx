'use client';

import { useState, useTransition } from 'react';
import {
  Settings,
  Palette,
  Image as ImageIcon,
  Layout,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Check,
  Eye,
  EyeOff,
  Key,
  Info,
} from 'lucide-react';
import { SelectSiteSettings } from '@/db/schema';
import { updateSiteSettingsAction } from '@/actions/settings-actions';
import { ImageUpload } from '@/components/ui/ImageUpload';

interface SettingsManagerProps {
  initialSettings: SelectSiteSettings;
}

const COLOR_PALETTES = [
  {
    id: 'amber',
    name: 'Ámbar Dorado',
    description: 'Cálido, vibrante y elegante. Resalta dorados sobre fondos oscuros.',
    colors: ['#f59e0b', '#d97706', '#0f172a'],
    border: 'border-amber-500/50',
    bg: 'bg-amber-500/10',
  },
  {
    id: 'emerald',
    name: 'Verde Esmeralda',
    description: 'Inspirado en los territorios comunitarios y la biodiversidad.',
    colors: ['#10b981', '#059669', '#064e3b'],
    border: 'border-emerald-500/50',
    bg: 'bg-emerald-500/10',
  },
  {
    id: 'terracotta',
    name: 'Terracota Cálido',
    description: 'Tonos arcilla y tierra afropolitana de gran riqueza visual.',
    colors: ['#f97316', '#ea580c', '#431407'],
    border: 'border-orange-500/50',
    bg: 'bg-orange-500/10',
  },
  {
    id: 'purple',
    name: 'Púrpura Imperial',
    description: 'Sofisticado, místico y ceremonial con destellos dorados.',
    colors: ['#a855f7', '#7e22ce', '#3b0764'],
    border: 'border-purple-500/50',
    bg: 'bg-purple-500/10',
  },
  {
    id: 'blue',
    name: 'Azul Océano',
    description: 'Profundo, institucional y conectado con las rutas de la diáspora.',
    colors: ['#3b82f6', '#1d4ed8', '#1e3a8a'],
    border: 'border-blue-500/50',
    bg: 'bg-blue-500/10',
  },
];

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showApiSecret, setShowApiSecret] = useState(false);

  // Form states
  const [siteTitle, setSiteTitle] = useState(initialSettings.siteTitle || 'Afropolíticas');
  const [siteSubtitle, setSiteSubtitle] = useState(initialSettings.siteSubtitle || 'Pensamiento y Memoria');
  const [logoUrl, setLogoUrl] = useState(initialSettings.logoUrl || '');
  const [colorPalette, setColorPalette] = useState(initialSettings.colorPalette || 'amber');
  const [heroBadge, setHeroBadge] = useState(initialSettings.heroBadge || 'Plataforma de Investigación y Visibilización');
  const [heroTitle, setHeroTitle] = useState(initialSettings.heroTitle || 'Pensamiento, Saberes y Memoria Afropolitana');
  const [heroSubtitle, setHeroSubtitle] = useState(
    initialSettings.heroSubtitle ||
      'Un espacio dedicado al directorio de investigadoras y referentes, la difusión de noticias y el reconocimiento histórico de líderes afropolitanos.'
  );
  const [heroImageUrl, setHeroImageUrl] = useState(
    initialSettings.heroImageUrl ||
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80'
  );

  // Cloudinary credentials states
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState(initialSettings.cloudinaryCloudName || 'dmhg7tph');
  const [cloudinaryApiKey, setCloudinaryApiKey] = useState(initialSettings.cloudinaryApiKey || '216771112977243');
  const [cloudinaryApiSecret, setCloudinaryApiSecret] = useState(initialSettings.cloudinaryApiSecret || '');
  const [cloudinaryUploadPreset, setCloudinaryUploadPreset] = useState(initialSettings.cloudinaryUploadPreset || 'ml_default');

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateSiteSettingsAction({
        siteTitle,
        siteSubtitle,
        logoUrl,
        colorPalette,
        heroBadge,
        heroTitle,
        heroSubtitle,
        heroImageUrl,
        cloudinaryCloudName,
        cloudinaryApiKey,
        cloudinaryApiSecret,
        cloudinaryUploadPreset,
      });

      if (res.success) {
        showToast('success', 'Configuración del sitio y credenciales de Cloudinary actualizadas correctamente.');
      } else {
        showToast('error', res.error || 'Error al guardar la configuración.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in relative">
      {/* Toast Feedback */}
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

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
            <Settings className="w-4 h-4" />
            <span>Configuración General</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            Personalización del Sitio y Cloudinary API
          </h2>
          <p className="text-xs text-slate-400">
            Configura las credenciales de la API de Cloudinary, el logo, la paleta cromática global y el Hero.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </>
          )}
        </button>
      </div>

      {/* SECCIÓN: CONFIGURACIÓN DE LA API DE CLOUDINARY */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Credenciales de la API de Cloudinary</h3>
            <p className="text-xs text-slate-400">
              Ingresa tus claves de Cloudinary para que todas las imágenes del sitio se suban directamente a tu cuenta.
            </p>
          </div>
        </div>

        {/* Guía informativa */}
        <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/20 text-xs text-sky-200 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-sky-300">
            <Info className="w-4 h-4" />
            <span>¿Dónde encontrar estas credenciales?</span>
          </div>
          <p className="leading-relaxed text-slate-300">
            Inicia sesión en tu consola de <strong>Cloudinary</strong>. En el <strong>Dashboard</strong> encontrarás tu <em>Cloud Name</em> (ej. <code>dmhg7tph</code>), <em>API Key</em> (ej. <code>216771112977243</code>) y <em>API Secret</em>. En <strong>Settings ⚙️ → Upload → Upload Presets</strong> usa tu preset Unsigned (ej. <code>ml_default</code>).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cloud Name */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase text-slate-400">
              Cloud Name *
            </label>
            <div className="relative">
              <input
                type="text"
                value={cloudinaryCloudName}
                onChange={(e) => setCloudinaryCloudName(e.target.value)}
                placeholder="ej. dmhg7tph"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Upload Preset */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase text-slate-400">
              Upload Preset (Unsigned) *
            </label>
            <div className="relative">
              <input
                type="text"
                value={cloudinaryUploadPreset}
                onChange={(e) => setCloudinaryUploadPreset(e.target.value)}
                placeholder="ej. ml_default"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>

          {/* API Key */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase text-slate-400 flex items-center space-x-1">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>API Key</span>
            </label>
            <input
              type="text"
              value={cloudinaryApiKey}
              onChange={(e) => setCloudinaryApiKey(e.target.value)}
              placeholder="ej. 216771112977243"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>

          {/* API Secret */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase text-slate-400 flex items-center space-x-1">
              <Key className="w-3.5 h-3.5 text-rose-400" />
              <span>API Secret</span>
            </label>
            <div className="relative">
              <input
                type={showApiSecret ? 'text' : 'password'}
                value={cloudinaryApiSecret}
                onChange={(e) => setCloudinaryApiSecret(e.target.value)}
                placeholder="••••••••••••••••••••••••••••"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowApiSecret(!showApiSecret)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
              >
                {showApiSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN: LOGO E IDENTIDAD VISUAL */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Identidad y Logo Personalizado</h3>
            <p className="text-xs text-slate-400">
              Sube una imagen de logo para reemplazar la marca predeterminada <code>[A] Afropolíticas Pensamiento y Memoria</code>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase text-slate-400">
              Logo Oficial del Portal (Cloudinary)
            </label>
            <ImageUpload
              value={logoUrl}
              onUpload={(url) => setLogoUrl(url)}
              onRemove={() => setLogoUrl('')}
              uploadPreset={cloudinaryUploadPreset || 'ml_default'}
              cloudName={cloudinaryCloudName || 'dmhg7tph'}
            />
            <p className="text-[11px] text-slate-500">
              Formato recomendado: PNG transparente o SVG.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase text-slate-400">
                Título del Sitio
              </label>
              <input
                type="text"
                required
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase text-slate-400">
                Subtítulo / Lema de Marca
              </label>
              <input
                type="text"
                value={siteSubtitle}
                onChange={(e) => setSiteSubtitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN: PALETA DE COLORES GLOBAL */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Paletas de Colores para el Sitio Web</h3>
            <p className="text-xs text-slate-400">
              Selecciona la combinación cromática que armonizará los botones, insignias y acentos en todo el portal.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COLOR_PALETTES.map((p) => {
            const isSelected = colorPalette === p.id;

            return (
              <div
                key={p.id}
                onClick={() => setColorPalette(p.id)}
                className={`p-5 rounded-2xl bg-slate-950 border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? `${p.border} ${p.bg} shadow-lg ring-2 ring-amber-500/40`
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-100">{p.name}</span>
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Activa</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {p.description}
                </p>

                {/* Swatch Preview */}
                <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/80">
                  {p.colors.map((c, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border border-slate-700 shadow-inner"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN: HERO EDITABLE CON IMAGEN BANNER DE COMUNIDAD */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Configuración del Hero Principal</h3>
            <p className="text-xs text-slate-400">
              Personaliza el mensaje de bienvenida y la imagen de banner institucional de la página de inicio.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Hero Image Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase text-slate-400">
              Imagen Banner de Comunidad / Hero (Cloudinary)
            </label>
            <ImageUpload
              value={heroImageUrl}
              onUpload={(url) => setHeroImageUrl(url)}
              onRemove={() => setHeroImageUrl('')}
              uploadPreset={cloudinaryUploadPreset || 'ml_default'}
              cloudName={cloudinaryCloudName || 'dmhg7tph'}
            />
            <p className="text-[11px] text-slate-500">
              Recomendación: Sube una foto panorámica de comunidad, evento o colectivo afropolitano.
            </p>
          </div>

          {/* Hero Text Fields */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase text-slate-400">
                Insignia / Tagline Superior
              </label>
              <input
                type="text"
                value={heroBadge}
                onChange={(e) => setHeroBadge(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase text-slate-400">
                Título Principal del Hero
              </label>
              <input
                type="text"
                required
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase text-slate-400">
                Descripción / Subtítulo del Hero
              </label>
              <textarea
                rows={3}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-xl shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Guardando Cambios...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Guardar Configuración General</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
