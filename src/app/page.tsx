import Link from 'next/link';
import { Users, Newspaper, Award, ArrowRight, Sparkles } from 'lucide-react';
import { getSiteSettingsAction } from '@/actions/settings-actions';
import { CldImageWrapper } from '@/components/public/CldImageWrapper';

export default async function HomePage() {
  const settings = await getSiteSettingsAction();

  return (
    <div className="flex-1 flex flex-col space-y-16 py-8 sm:py-12 bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 pt-4">
        {/* Glow Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Text Header */}
        <div className="text-center space-y-6 max-w-4xl mx-auto relative z-10">
          {settings.heroBadge && (
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings.heroBadge}</span>
            </div>
          )}

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {settings.heroTitle ? (
              <span className="text-white">{settings.heroTitle}</span>
            ) : (
              <>
                Pensamiento, Saberes y{' '}
                <span className="text-amber-400 underline decoration-amber-500/40">
                  Memoria Afropolitana
                </span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            {settings.heroSubtitle ||
              'Un espacio dedicado al directorio de investigadoras y referentes, la difusión de noticias y el reconocimiento histórico de líderes afropolitanos.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/directorio"
              className="px-6 py-3.5 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-xl shadow-amber-500/25 transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
            >
              <span>Explorar Directorio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/noticias"
              className="px-6 py-3.5 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              Ver Noticias
            </Link>
          </div>
        </div>

        {/* Impactful Hero Community Banner */}
        {settings.heroImageUrl && (
          <div className="relative w-full h-72 sm:h-[440px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
            <CldImageWrapper
              src={settings.heroImageUrl}
              alt="Colectivo Afropolíticas"
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Subtle Modern Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
              <div className="bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 text-xs font-bold text-white shadow-xl flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Comunidad, Pensamiento Colectivo y Memoria Viva</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Feature Cards Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Explora las Secciones del Portal
          </h2>
          <p className="text-slate-300 font-medium text-xs sm:text-sm max-w-xl mx-auto">
            Accede al conocimiento y patrimonio afropolitano a través de nuestros módulos principales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: Directorio */}
          <Link
            href="/directorio"
            className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/60 shadow-2xl transition-all hover:-translate-y-1 group flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                Directorio por Países
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Encuentra perfiles de investigadoras, académicas y líderes filtrando directamente por país de origen.
              </p>
            </div>

            <div className="flex items-center text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Ir al Directorio →</span>
            </div>
          </Link>

          {/* Card 2: Noticias */}
          <Link
            href="/noticias"
            className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/60 shadow-2xl transition-all hover:-translate-y-1 group flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                <Newspaper className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                Noticias y Artículos
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Mantente al día con publicaciones, comunicados y novedades de impacto en la comunidad afropolitana.
              </p>
            </div>

            <div className="flex items-center text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Leer Noticias →</span>
            </div>
          </Link>

          {/* Card 3: Homenajes */}
          <Link
            href="/homenajes"
            className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/60 shadow-2xl transition-all hover:-translate-y-1 group flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                Galería de Homenajes
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Galería dedicada al reconocimiento de personalidades e hitos culturales indispensables.
              </p>
            </div>

            <div className="flex items-center text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Ver Homenajes →</span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
