import { getCountriesAction } from '@/actions/country-actions';
import { getProfilesAction } from '@/actions/profile-actions';
import { DirectorioManager } from '@/components/admin/directorio/DirectorioManager';

export const dynamic = 'force-dynamic';

export default async function DirectorioAdminPage() {
  const [countries, profiles] = await Promise.all([
    getCountriesAction(),
    getProfilesAction(),
  ]);

  return (
    <DirectorioManager
      initialCountries={countries}
      initialProfiles={profiles}
    />
  );
}
