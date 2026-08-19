import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';
import { ThemeProvider } from '@/components/public/ThemeProvider';
import { getSiteSettingsAction } from '@/actions/settings-actions';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettingsAction();

  return (
    <html
      lang="es"
      data-theme={settings.colorPalette || 'amber'}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
        <ThemeProvider palette={settings.colorPalette}>
          <PublicHeader
            logoUrl={settings.logoUrl}
            siteTitle={settings.siteTitle}
            siteSubtitle={settings.siteSubtitle}
          />
          <div className="flex-1 flex flex-col">{children}</div>
          <PublicFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
