import { auth } from '@/auth';
import Link from 'next/link';
import { ArrowRight, Globe, Users, Newspaper, Award, Settings } from 'lucide-react';

export default async function AdminDashboardPage() {
  const session = await auth();

  const cards = [
    {
      title: 'Países (Country)',
      description: 'Gestión de ubicaciones y países disponibles en el directorio.',
      icon: Globe,
      count: 'Directorio',
      href: '/admin/directorio',
      accent: 'border-blue-500/30 hover:border-blue-500/60 text-blue-400',
    },
    {
      title: 'Perfiles (Profile)',
      description: 'Gestión del directorio de personalidades e investigadoras.',
      icon: Users,
      count: 'Directorio',
      href: '/admin/directorio',
      accent: 'border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400',
    },
    {
      title: 'Noticias (Post)',
      description: 'Publicación y edición de artículos y novedades.',
      icon: Newspaper,
      count: 'Noticias',
      href: '/admin/noticias',
      accent: 'border-amber-500/30 hover:border-amber-500/60 text-amber-400',
    },
    {
      title: 'Homenajes (Tribute)',
      description: 'Gestión de homenajes y reconocimientos culturales.',
      icon: Award,
      count: 'Homenajes',
      href: '/admin/homenajes',
      accent: 'border-purple-500/30 hover:border-purple-500/60 text-purple-400',
    },
    {
      title: 'Configuración General',
      description: 'Logo, paleta de colores, Hero principal y claves de API de Cloudinary.',
      icon: Settings,
      count: 'Ajustes',
      href: '/admin/configuracion',
      accent: 'border-sky-500/30 hover:border-sky-500/60 text-sky-400',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Panel de Control Protegido
          </span>
          <h1 className="text-3xl font-extrabold text-slate-100">
            Bienvenido, {session?.user?.name || 'Administrador'}
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Has iniciado sesión exitosamente con la cuenta{' '}
            <code className="text-amber-300 bg-slate-950 px-2 py-0.5 rounded font-mono text-xs border border-slate-800">
              {session?.user?.email}
            </code>
            . Desde aquí puedes administrar la información que se muestra en la página web.
          </p>
        </div>
      </div>

      {/* Grid of Entity Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-200">
          Módulos de Administración
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className={`p-6 rounded-2xl bg-slate-900/80 border ${card.accent} backdrop-blur shadow-xl transition-all hover:-translate-y-1 group flex flex-col justify-between space-y-4 cursor-pointer`}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className={`w-6 h-6 ${card.accent.split(' ').pop()}`} />
                  </div>
                  <h3 className="font-bold text-slate-100 text-lg group-hover:text-amber-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    {card.count}
                  </span>
                  <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold group-hover:translate-x-1 transition-transform">
                    <span>Gestionar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
