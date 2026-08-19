import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Afropolíticas — Visibilización, Investigación y Memoria',
  description:
    'Portal de visibilización, directorio de investigadoras y líderes, noticias y galería de homenajes afropolitanos.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
        <PublicHeader />
        <div className="flex-1 flex flex-col">{children}</div>
        <PublicFooter />
      </body>
    </html>
  );
}
