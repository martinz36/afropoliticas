'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

interface SignOutButtonProps {
  collapsed?: boolean;
  className?: string;
}

export function SignOutButton({ collapsed = false, className = '' }: SignOutButtonProps) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      title="Cerrar Sesión"
      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all ${
        collapsed ? 'justify-center' : ''
      } ${className}`}
    >
      <LogOut className="w-5 h-5 shrink-0" />
      {!collapsed && <span>Cerrar Sesión</span>}
    </button>
  );
}
