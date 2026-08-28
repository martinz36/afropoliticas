import { auth } from '@/auth';
import { getSiteSettingsAction } from '@/actions/settings-actions';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, settings] = await Promise.all([
    auth(),
    getSiteSettingsAction(),
  ]);

  return (
    <AdminLayoutClient
      userName={session?.user?.name || 'Administrador'}
      userEmail={session?.user?.email || 'admin@afropoliticas.org'}
      cloudinaryCloudName={settings?.cloudinaryCloudName}
      cloudinaryUploadPreset={settings?.cloudinaryUploadPreset}
    >
      {children}
    </AdminLayoutClient>
  );
}
