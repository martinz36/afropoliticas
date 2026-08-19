'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function PublicFooter() {
  const pathname = usePathname();

  // Ocultar footer público en el panel /admin o /login
  if (pathname.startsWith('/admin') || pathname === '/login') {
    return null;
  }

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand info */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-700 text-slate-950 font-black text-base flex items-center justify-center">
              A
            </div>
            <span className="font-bold text-lg text-slate-100">Afropolíticas</span>
          </div>
          <p className="text-slate-400 leading-relaxed max-w-sm">
            Plataforma dedicada a la visibilización, investigación, directorio de saberes y preservación de la memoria afropolitana.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-200 text-sm uppercase tracking-wider">
            Navegación
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-amber-400 transition-colors">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/directorio" className="hover:text-amber-400 transition-colors">
                Directorio de Perfiles
              </Link>
            </li>
            <li>
              <Link href="/noticias" className="hover:text-amber-400 transition-colors">
                Noticias y Comunicados
              </Link>
            </li>
            <li>
              <Link href="/homenajes" className="hover:text-amber-400 transition-colors">
                Galería de Homenajes
              </Link>
            </li>
          </ul>
        </div>

        {/* Admin Access */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-200 text-sm uppercase tracking-wider">
            Administración
          </h4>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Acceso exclusivo para el equipo de edición y gestión de contenidos.
          </p>
          <Link
            href="/admin"
            className="inline-block px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 font-semibold text-xs transition-colors"
          >
            Acceso Administrador →
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-slate-600 text-[11px]">
        <p>© {new Date().getFullYear()} Afropolíticas. Todos los derechos reservados.</p>
        <p className="mt-2 sm:mt-0">Impulsado por Neon DB, Drizzle ORM y Cloudinary</p>
      </div>
    </footer>
  );
}
