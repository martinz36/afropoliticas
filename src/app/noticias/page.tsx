import { getPostsAction } from '@/actions/post-actions';
import { NoticiasGrid } from '@/components/public/NoticiasGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Noticias y Artículos — Afropolíticas',
  description:
    'Noticias, artículos, novedades y comunicados más recientes del portal Afropolíticas.',
};

export const revalidate = 60; // Revalidación ISR cada 60 segundos

export default async function PublicNoticiasPage() {
  const posts = await getPostsAction();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      <NoticiasGrid posts={posts} />
    </main>
  );
}
