'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Users, Newspaper, Award, Home, Lock } from 'lucide-react';

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // No renderizar la barra pública si estamos dentro de /admin
  if (pathname.startsWith('/admin') || pathname === '/login') {
    return null;
  }

  const navLinks = [
    { label: 'Inicio', href: '/', icon: Home },
    { label: 'Directorio', href: '/directorio', icon: Users },
    { label: 'Noticias', href: '/noticias', icon: Newspaper },
    { label: 'Homenajes', href: '/homenajes', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            A
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg sm:text-xl tracking-tight text-slate-100 group-hover:text-amber-400 transition-colors">
              Afropolíticas
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-amber-500/90 -mt-1">
              Pensamiento y Memoria
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="w-px h-6 bg-slate-800 mx-2" />

          {/* Admin Login Link */}
          <Link
            href="/admin"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-amber-300 hover:bg-slate-900 border border-slate-800 transition-all flex items-center space-x-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Acceso Admin</span>
          </Link>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-all"
          aria-label="Abrir Menú"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-fade-in backdrop-blur-2xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-800">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20"
            >
              <Lock className="w-5 h-5 text-amber-400" />
              <span>Acceso Administrador</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
