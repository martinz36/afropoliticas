'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Newspaper,
  Award,
  ChevronLeft,
  ChevronRight,
  X,
  ShieldCheck,
} from 'lucide-react';
import { SignOutButton } from './SignOutButton';

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean | ((prev: boolean) => boolean)) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
  userName?: string;
  userEmail?: string;
}

export function AdminSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  userName = 'Administrador',
  userEmail = 'admin@afropoliticas.org',
}: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Directorio', href: '/admin/directorio', icon: Users },
    { label: 'Noticias', href: '/admin/noticias', icon: Newspaper },
    { label: 'Homenajes', href: '/admin/homenajes', icon: Award },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl ${
          // Mobile state
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${
          // Desktop state
          collapsed ? 'lg:w-20' : 'lg:w-64'
        }`}
      >
        {/* Header / Brand */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 text-slate-950 font-black text-xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
              A
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-sm text-slate-100 truncate tracking-tight">
                  Afropolíticas
                </span>
                <span className="text-[10px] uppercase font-mono font-semibold text-amber-400">
                  Panel Admin
                </span>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30 shadow-inner'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                } ${collapsed && !mobileOpen ? 'justify-center' : ''}`}
                title={collapsed && !mobileOpen ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {(!collapsed || mobileOpen) && (
                  <span className="truncate">{item.label}</span>
                )}

                {/* Tooltip for Collapsed Sidebar */}
                {collapsed && !mobileOpen && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-800 text-slate-100 text-xs font-semibold rounded-md shadow-xl border border-slate-700 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer Area: User Profile & Collapse Toggle */}
        <div className="p-3 border-t border-slate-800/80 space-y-3 bg-slate-950/40">
          {/* User Info Badge */}
          {(!collapsed || mobileOpen) ? (
            <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {userName}
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate">
                  {userEmail}
                </p>
              </div>
            </div>
          ) : null}

          {/* SignOut Button */}
          <SignOutButton collapsed={collapsed && !mobileOpen} />

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="hidden lg:flex w-full items-center justify-center py-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 rounded-xl transition-all border border-slate-800"
            title={collapsed ? 'Expandir Sidebar' : 'Colapsar Sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <div className="flex items-center space-x-2 text-xs font-medium">
                <ChevronLeft className="w-4 h-4" />
                <span>Colapsar menú</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
