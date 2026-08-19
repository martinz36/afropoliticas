import { auth } from '@/auth';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <AdminLayoutClient
      userName={session?.user?.name || 'Administrador'}
      userEmail={session?.user?.email || 'admin@afropoliticas.org'}
    >
      {children}
    </AdminLayoutClient>
  );
}
