'use server';

import { db, posts } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export interface PostInput {
  title: string;
  content: string;
  imageUrl?: string | null;
  externalLink?: string | null;
}

export async function getPostsAction() {
  try {
    return await db.select().from(posts).orderBy(desc(posts.createdAt));
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    return [];
  }
}

export async function createPostAction(data: PostInput) {
  try {
    if (!data.title || !data.title.trim()) {
      return { success: false, error: 'El título de la noticia es obligatorio.' };
    }
    if (!data.content || !data.content.trim()) {
      return { success: false, error: 'El contenido de la noticia es obligatorio.' };
    }

    const [newPost] = await db
      .insert(posts)
      .values({
        title: data.title.trim(),
        content: data.content.trim(),
        imageUrl: data.imageUrl || null,
        externalLink: data.externalLink?.trim() || null,
      })
      .returning();

    revalidatePath('/admin/noticias');
    return { success: true, data: newPost };
  } catch (error) {
    console.error('Error al crear noticia:', error);
    return { success: false, error: 'Error al registrar la noticia en la base de datos.' };
  }
}

export async function updatePostAction(id: number, data: PostInput) {
  try {
    if (!data.title || !data.title.trim()) {
      return { success: false, error: 'El título de la noticia es obligatorio.' };
    }
    if (!data.content || !data.content.trim()) {
      return { success: false, error: 'El contenido de la noticia es obligatorio.' };
    }

    const [updatedPost] = await db
      .update(posts)
      .set({
        title: data.title.trim(),
        content: data.content.trim(),
        imageUrl: data.imageUrl || null,
        externalLink: data.externalLink?.trim() || null,
      })
      .where(eq(posts.id, id))
      .returning();

    revalidatePath('/admin/noticias');
    return { success: true, data: updatedPost };
  } catch (error) {
    console.error('Error al actualizar noticia:', error);
    return { success: false, error: 'Error al actualizar la noticia.' };
  }
}

export async function deletePostAction(id: number) {
  try {
    await db.delete(posts).where(eq(posts.id, id));
    revalidatePath('/admin/noticias');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar noticia:', error);
    return { success: false, error: 'Error al eliminar la noticia.' };
  }
}
