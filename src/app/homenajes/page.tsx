import { getTributesAction } from '@/actions/tribute-actions';
import { HomenajesGallery } from '@/components/public/HomenajesGallery';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Galería de Homenajes — Afropolíticas',
  description:
    'Galería cultural de reconocimientos y tributos a personalidades e hitos de la memoria afropolitana.',
};

export const revalidate = 60; // Revalidación ISR cada 60 segundos

export default async function PublicHomenajesPage() {
  const tributes = await getTributesAction();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      <HomenajesGallery tributes={tributes} />
    </main>
  );
}
