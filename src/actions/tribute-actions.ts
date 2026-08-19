'use server';

import { db, tributes } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export interface TributeInput {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
}

export async function getTributesAction() {
  try {
    return await db.select().from(tributes).orderBy(desc(tributes.createdAt));
  } catch (error) {
    console.error('Error al obtener homenajes:', error);
    return [];
  }
}

export async function createTributeAction(data: TributeInput) {
  try {
    if (!data.name || !data.name.trim()) {
      return { success: false, error: 'El nombre del homenajeado es obligatorio.' };
    }

    const [newTribute] = await db
      .insert(tributes)
      .values({
        name: data.name.trim(),
        description: data.description?.trim() || null,
        imageUrl: data.imageUrl || null,
      })
      .returning();

    revalidatePath('/admin/homenajes');
    return { success: true, data: newTribute };
  } catch (error) {
    console.error('Error al crear homenaje:', error);
    return { success: false, error: 'Error al registrar el homenaje en la base de datos.' };
  }
}

export async function updateTributeAction(id: number, data: TributeInput) {
  try {
    if (!data.name || !data.name.trim()) {
      return { success: false, error: 'El nombre del homenajeado es obligatorio.' };
    }

    const [updatedTribute] = await db
      .update(tributes)
      .set({
        name: data.name.trim(),
        description: data.description?.trim() || null,
        imageUrl: data.imageUrl || null,
      })
      .where(eq(tributes.id, id))
      .returning();

    revalidatePath('/admin/homenajes');
    return { success: true, data: updatedTribute };
  } catch (error) {
    console.error('Error al actualizar homenaje:', error);
    return { success: false, error: 'Error al actualizar el registro de homenaje.' };
  }
}

export async function deleteTributeAction(id: number) {
  try {
    await db.delete(tributes).where(eq(tributes.id, id));
    revalidatePath('/admin/homenajes');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar homenaje:', error);
    return { success: false, error: 'Error al eliminar el registro.' };
  }
}
