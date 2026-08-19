'use server';

import { db, profiles, countries } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export interface ProfileWithCountry {
  id: number;
  name: string;
  bio: string | null;
  imageUrl: string | null;
  countryId: number | null;
  countryName?: string | null;
}

export async function getProfilesAction(): Promise<ProfileWithCountry[]> {
  try {
    const result = await db
      .select({
        id: profiles.id,
        name: profiles.name,
        bio: profiles.bio,
        imageUrl: profiles.imageUrl,
        countryId: profiles.countryId,
        countryName: countries.name,
      })
      .from(profiles)
      .leftJoin(countries, eq(profiles.countryId, countries.id))
      .orderBy(desc(profiles.id));

    return result;
  } catch (error) {
    console.error('Error al obtener perfiles:', error);
    return [];
  }
}

export interface ProfileInput {
  name: string;
  bio?: string | null;
  imageUrl?: string | null;
  countryId?: number | null;
}

export async function createProfileAction(data: ProfileInput) {
  try {
    if (!data.name || !data.name.trim()) {
      return { success: false, error: 'El nombre completo es obligatorio.' };
    }

    const [newProfile] = await db
      .insert(profiles)
      .values({
        name: data.name.trim(),
        bio: data.bio?.trim() || null,
        imageUrl: data.imageUrl || null,
        countryId: data.countryId ? Number(data.countryId) : null,
      })
      .returning();

    revalidatePath('/admin/directorio');
    return { success: true, data: newProfile };
  } catch (error) {
    console.error('Error al crear perfil:', error);
    return { success: false, error: 'Error al registrar el perfil en la base de datos.' };
  }
}

export async function updateProfileAction(id: number, data: ProfileInput) {
  try {
    if (!data.name || !data.name.trim()) {
      return { success: false, error: 'El nombre completo es obligatorio.' };
    }

    const [updatedProfile] = await db
      .update(profiles)
      .set({
        name: data.name.trim(),
        bio: data.bio?.trim() || null,
        imageUrl: data.imageUrl || null,
        countryId: data.countryId ? Number(data.countryId) : null,
      })
      .where(eq(profiles.id, id))
      .returning();

    revalidatePath('/admin/directorio');
    return { success: true, data: updatedProfile };
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return { success: false, error: 'Error al actualizar el registro del perfil.' };
  }
}

export async function deleteProfileAction(id: number) {
  try {
    await db.delete(profiles).where(eq(profiles.id, id));
    revalidatePath('/admin/directorio');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar perfil:', error);
    return { success: false, error: 'Error al eliminar el registro.' };
  }
}
