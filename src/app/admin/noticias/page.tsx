import { getPostsAction } from '@/actions/post-actions';
import { NoticiasManager } from '@/components/admin/noticias/NoticiasManager';

export const dynamic = 'force-dynamic';

export default async function NoticiasAdminPage() {
  const posts = await getPostsAction();

  return <NoticiasManager initialPosts={posts} />;
}
