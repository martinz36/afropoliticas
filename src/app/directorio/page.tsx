import { getCountriesAction } from '@/actions/country-actions';
import { getProfilesAction } from '@/actions/profile-actions';
import { DirectorioClient } from '@/components/public/DirectorioClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Directorio de Perfiles — Afropolíticas',
  description:
    'Explora nuestro directorio de perfiles de investigadoras, personalidades y referentes afropolitanas por país.',
};

export const revalidate = 60; // Revalidar cada 60 segundos (ISR)

export default async function PublicDirectorioPage() {
  const [countries, profiles] = await Promise.all([
    getCountriesAction(),
    getProfilesAction(),
  ]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      <DirectorioClient countries={countries} profiles={profiles} />
    </main>
  );
}
