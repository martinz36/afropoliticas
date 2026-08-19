import { getTributesAction } from '@/actions/tribute-actions';
import { HomenajesManager } from '@/components/admin/homenajes/HomenajesManager';

export const dynamic = 'force-dynamic';

export default async function HomenajesAdminPage() {
  const tributes = await getTributesAction();

  return <HomenajesManager initialTributes={tributes} />;
}
