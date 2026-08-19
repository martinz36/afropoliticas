'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Users, Newspaper, Award, Home, Lock } from 'lucide-react';
import Image from 'next/image';

interface PublicHeaderProps {
  logoUrl?: string | null;
  siteTitle?: string;
  siteSubtitle?: string | null;
}

export function PublicHeader({
  logoUrl,
  siteTitle = 'Afropolíticas',
  siteSubtitle = 'Pensamiento y Memoria',
}: PublicHeaderProps) {
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
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 border-b border-slate-800 backdrop-blur-xl shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          {logoUrl ? (
            <div className="relative h-10 sm:h-12 w-auto min-w-[120px] flex items-center">
              <Image
                src={logoUrl}
                alt={siteTitle}
                width={180}
                height={48}
                className="object-contain max-h-12 w-auto group-hover:scale-105 transition-transform"
                unoptimized
              />
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                {siteTitle.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  {siteTitle}
                </span>
                {siteSubtitle && (
                  <span className="text-[10px] tracking-widest uppercase font-bold text-amber-400 -mt-1">
                    {siteSubtitle}
                  </span>
                )}
              </div>
            </>
          )}
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner'
                    : 'text-slate-200 hover:text-white hover:bg-slate-900 border border-transparent'
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
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-amber-300 bg-slate-900 hover:bg-slate-800 border border-amber-500/30 transition-all flex items-center space-x-1.5 shadow-sm"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Acceso Admin</span>
          </Link>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-900 border border-slate-800 transition-all"
          aria-label="Abrir Menú"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-fade-in backdrop-blur-2xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-200 hover:bg-slate-900'
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
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-amber-300 bg-slate-900 border border-amber-500/30"
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
