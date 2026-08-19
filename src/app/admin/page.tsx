import { auth } from '@/auth';

export default async function AdminDashboardPage() {
  const session = await auth();

  const cards = [
    {
      title: 'Países (Country)',
      description: 'Gestión de ubicaciones y países disponibles en el directorio.',
      icon: '🌍',
      count: 'Directorio',
      accent: 'border-blue-500/30 hover:border-blue-500/60',
    },
    {
      title: 'Perfiles (Profile)',
      description: 'Gestión del directorio de personalidades e investigadoras.',
      icon: '👥',
      count: 'Directorio',
      accent: 'border-emerald-500/30 hover:border-emerald-500/60',
    },
    {
      title: 'Noticias (Post)',
      description: 'Publicación y edición de artículos y novedades.',
      icon: '📰',
      count: 'Noticias',
      accent: 'border-amber-500/30 hover:border-amber-500/60',
    },
    {
      title: 'Homenajes (Tribute)',
      description: 'Gestión de homenajes y reconocimientos culturales.',
      icon: '🏆',
      count: 'Homenajes',
      accent: 'border-purple-500/30 hover:border-purple-500/60',
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
          <p className="text-slate-400 text-sm max-w-2xl">
            Has iniciado sesión exitosamente con la cuenta{' '}
            <code className="text-amber-300 bg-slate-950 px-2 py-0.5 rounded font-mono text-xs">
              {session?.user?.email}
            </code>
            . Desde aquí puedes administrar todas las entidades de la base de datos de Neon.
          </p>
        </div>
      </div>

      {/* Grid of Entity Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-200">
          Módulos de Administración
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`p-6 rounded-xl bg-slate-900/60 border ${card.accent} backdrop-blur shadow-lg transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-2">
                <div className="text-3xl">{card.icon}</div>
                <h3 className="font-bold text-slate-100 text-lg">{card.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-500 uppercase font-semibold">
                  {card.count}
                </span>
                <span className="text-amber-400 text-xs font-bold hover:underline">
                  Gestionar →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
