'use client';

import { usePathname } from 'next/navigation';
import { Menu, Shield, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
  userName?: string;
}

export function AdminHeader({ onOpenMobileMenu, userName }: AdminHeaderProps) {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    if (path === '/admin') return 'Dashboard Principal';
    if (path.startsWith('/admin/directorio')) return 'Gestión del Directorio';
    if (path.startsWith('/admin/noticias')) return 'Gestión de Noticias';
    if (path.startsWith('/admin/homenajes')) return 'Gestión de Homenajes';
    return 'Panel de Administración';
  };

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-slate-900/80 border-b border-slate-800 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all border border-slate-700/50"
          aria-label="Abrir Menú Lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-extrabold text-slate-100 tracking-tight">
            {getPageTitle(pathname)}
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Panel de Administración Afropolíticas
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Quick Link to Main Site */}
        <Link
          href="/"
          target="_blank"
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all hidden sm:flex items-center space-x-1.5"
        >
          <span>Ver Sitio Web</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* User Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span className="truncate max-w-[120px] sm:max-w-none">{userName || 'Admin'}</span>
        </div>
      </div>
    </header>
  );
}
