'use server';

import { db, countries } from '@/db';
import { eq, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getCountriesAction() {
  try {
    return await db.select().from(countries).orderBy(asc(countries.name));
  } catch (error) {
    console.error('Error al obtener países:', error);
    return [];
  }
}

export async function createCountryAction(name: string) {
  try {
    if (!name || !name.trim()) {
      return { success: false, error: 'El nombre del país es obligatorio.' };
    }

    const [newCountry] = await db
      .insert(countries)
      .values({ name: name.trim() })
      .returning();

    revalidatePath('/admin/directorio');
    return { success: true, data: newCountry };
  } catch (error) {
    console.error('Error al crear el país:', error);
    return { success: false, error: 'Error al conectar con la base de datos o crear el registro.' };
  }
}

export async function updateCountryAction(id: number, name: string) {
  try {
    if (!name || !name.trim()) {
      return { success: false, error: 'El nombre del país es obligatorio.' };
    }

    const [updatedCountry] = await db
      .update(countries)
      .set({ name: name.trim() })
      .where(eq(countries.id, id))
      .returning();

    revalidatePath('/admin/directorio');
    return { success: true, data: updatedCountry };
  } catch (error) {
    console.error('Error al actualizar el país:', error);
    return { success: false, error: 'Error al actualizar el registro.' };
  }
}

export async function deleteCountryAction(id: number) {
  try {
    await db.delete(countries).where(eq(countries.id, id));
    revalidatePath('/admin/directorio');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar el país:', error);
    return { success: false, error: 'Error al eliminar el registro.' };
  }
}
