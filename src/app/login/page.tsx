'use client';

import { useState, FormEvent, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
        redirectTo: callbackUrl,
      });

      if (res?.error) {
        setError('Credenciales inválidas. Verifica tu correo y contraseña.');
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError('Ocurrió un error inesperado al iniciar sesión.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl z-10 space-y-8 transition-all">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20 mb-2">
          A
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-slate-200 to-amber-400 bg-clip-text text-transparent">
          Afropolíticas Admin
        </h1>
        <p className="text-sm text-slate-400">
          Acceso exclusivo para administradores del sistema
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start space-x-3 animate-fade-in">
          <span className="text-lg">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Correo electrónico
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@afropoliticas.org"
            className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Contraseña
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:scale-[0.99] shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-slate-950" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Autenticando...</span>
            </>
          ) : (
            <span>Iniciar Sesión</span>
          )}
        </button>
      </form>

      {/* Footer info */}
      <div className="pt-4 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Afropolíticas — Panel de Administración
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden font-sans">
      {/* Background Glow Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-800/20 rounded-full blur-3xl pointer-events-none" />

      <Suspense
        fallback={
          <div className="w-full max-w-md p-10 rounded-2xl bg-slate-900/80 border border-slate-800 text-center text-slate-400">
            Cargando formulario de inicio de sesión...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
