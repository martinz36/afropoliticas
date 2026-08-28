'use server';

import { db, siteSettings, SelectSiteSettings } from '@/db';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export interface SiteSettingsInput {
  siteTitle: string;
  siteSubtitle?: string | null;
  logoUrl?: string | null;
  colorPalette: string;
  heroBadge?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroImageUrl?: string | null;
  cloudinaryCloudName?: string | null;
  cloudinaryApiKey?: string | null;
  cloudinaryApiSecret?: string | null;
  cloudinaryUploadPreset?: string | null;
}

const DEFAULT_SETTINGS: SelectSiteSettings = {
  id: 1,
  siteTitle: 'Afropolíticas',
  siteSubtitle: 'Pensamiento y Memoria',
  logoUrl: null,
  colorPalette: 'amber',
  heroBadge: 'Plataforma de Investigación y Visibilización',
  heroTitle: 'Pensamiento, Saberes y Memoria Afropolitana',
  heroSubtitle:
    'Un espacio dedicado al directorio de investigadoras y referentes, la difusión de noticias y el reconocimiento histórico de líderes afropolitanos.',
  heroImageUrl:
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80',
  cloudinaryCloudName: 'dmhg7tph',
  cloudinaryApiKey: '216771112977243',
  cloudinaryApiSecret: null,
  cloudinaryUploadPreset: 'ml_default',
  updatedAt: new Date(),
};

export async function getSiteSettingsAction(): Promise<SelectSiteSettings> {
  try {
    const existing = await db.select().from(siteSettings).limit(1);

    if (existing.length > 0) {
      const row = existing[0];
      return {
        ...row,
        cloudinaryCloudName: row.cloudinaryCloudName || 'dmhg7tph',
        cloudinaryApiKey: row.cloudinaryApiKey || '216771112977243',
        cloudinaryUploadPreset: row.cloudinaryUploadPreset || 'ml_default',
      };
    }

    // Si no existen ajustes, creamos el registro por defecto
    const [created] = await db
      .insert(siteSettings)
      .values({
        siteTitle: DEFAULT_SETTINGS.siteTitle,
        siteSubtitle: DEFAULT_SETTINGS.siteSubtitle,
        logoUrl: DEFAULT_SETTINGS.logoUrl,
        colorPalette: DEFAULT_SETTINGS.colorPalette,
        heroBadge: DEFAULT_SETTINGS.heroBadge,
        heroTitle: DEFAULT_SETTINGS.heroTitle,
        heroSubtitle: DEFAULT_SETTINGS.heroSubtitle,
        heroImageUrl: DEFAULT_SETTINGS.heroImageUrl,
        cloudinaryCloudName: DEFAULT_SETTINGS.cloudinaryCloudName,
        cloudinaryApiKey: DEFAULT_SETTINGS.cloudinaryApiKey,
        cloudinaryApiSecret: DEFAULT_SETTINGS.cloudinaryApiSecret,
        cloudinaryUploadPreset: DEFAULT_SETTINGS.cloudinaryUploadPreset,
      })
      .returning();

    return created || DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error al obtener la configuración del sitio:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSiteSettingsAction(data: SiteSettingsInput) {
  try {
    if (!data.siteTitle || !data.siteTitle.trim()) {
      return { success: false, error: 'El nombre del sitio es obligatorio.' };
    }

    const existing = await db.select().from(siteSettings).limit(1);

    let updated: SelectSiteSettings;

    if (existing.length > 0) {
      const [res] = await db
        .update(siteSettings)
        .set({
          siteTitle: data.siteTitle.trim(),
          siteSubtitle: data.siteSubtitle?.trim() || null,
          logoUrl: data.logoUrl || null,
          colorPalette: data.colorPalette || 'amber',
          heroBadge: data.heroBadge?.trim() || null,
          heroTitle: data.heroTitle?.trim() || null,
          heroSubtitle: data.heroSubtitle?.trim() || null,
          heroImageUrl: data.heroImageUrl || null,
          cloudinaryCloudName: data.cloudinaryCloudName?.trim() || 'dmhg7tph',
          cloudinaryApiKey: data.cloudinaryApiKey?.trim() || '216771112977243',
          cloudinaryApiSecret: data.cloudinaryApiSecret?.trim() || null,
          cloudinaryUploadPreset: data.cloudinaryUploadPreset?.trim() || 'ml_default',
          updatedAt: new Date(),
        })
        .where(eq(siteSettings.id, existing[0].id))
        .returning();
      updated = res;
    } else {
      const [res] = await db
        .insert(siteSettings)
        .values({
          siteTitle: data.siteTitle.trim(),
          siteSubtitle: data.siteSubtitle?.trim() || null,
          logoUrl: data.logoUrl || null,
          colorPalette: data.colorPalette || 'amber',
          heroBadge: data.heroBadge?.trim() || null,
          heroTitle: data.heroTitle?.trim() || null,
          heroSubtitle: data.heroSubtitle?.trim() || null,
          heroImageUrl: data.heroImageUrl || null,
          cloudinaryCloudName: data.cloudinaryCloudName?.trim() || 'dmhg7tph',
          cloudinaryApiKey: data.cloudinaryApiKey?.trim() || '216771112977243',
          cloudinaryApiSecret: data.cloudinaryApiSecret?.trim() || null,
          cloudinaryUploadPreset: data.cloudinaryUploadPreset?.trim() || 'ml_default',
        })
        .returning();
      updated = res;
    }

    revalidatePath('/', 'layout');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Error al guardar la configuración:', error);
    return { success: false, error: 'Ocurrió un error al guardar los ajustes en la base de datos.' };
  }
}
