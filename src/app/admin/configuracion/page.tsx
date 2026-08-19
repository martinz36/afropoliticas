import { getSiteSettingsAction } from '@/actions/settings-actions';
import { SettingsManager } from '@/components/admin/configuracion/SettingsManager';

export const dynamic = 'force-dynamic';

export default async function ConfiguracionAdminPage() {
  const settings = await getSiteSettingsAction();

  return <SettingsManager initialSettings={settings} />;
}
