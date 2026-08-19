import { pgTable, serial, text, varchar, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * 1. Country Schema
 */
export const countries = pgTable('country', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
});

/**
 * 2. Profile Schema (Directorio)
 * (id, name, bio, image_url, country_id)
 */
export const profiles = pgTable('profile', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  bio: text('bio'),
  imageUrl: text('image_url'),
  countryId: integer('country_id').references(() => countries.id, { onDelete: 'set null' }),
});

/**
 * 3. Post Schema (Noticias)
 * (id, title, content, image_url, external_link, created_at)
 */
export const posts = pgTable('post', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  externalLink: text('external_link'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

/**
 * 4. Tribute Schema (Homenajes)
 * (id, name, description, image_url, created_at)
 */
export const tributes = pgTable('tribute', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

/**
 * 5. SiteSettings Schema (Configuración General)
 * (id, site_title, site_subtitle, logo_url, color_palette, hero_badge, hero_title, hero_subtitle, hero_image_url, updated_at)
 */
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  siteTitle: varchar('site_title', { length: 255 }).default('Afropolíticas').notNull(),
  siteSubtitle: varchar('site_subtitle', { length: 255 }).default('Pensamiento y Memoria'),
  logoUrl: text('logo_url'),
  colorPalette: varchar('color_palette', { length: 50 }).default('amber').notNull(),
  heroBadge: varchar('hero_badge', { length: 255 }).default('Plataforma de Investigación y Visibilización'),
  heroTitle: text('hero_title').default('Pensamiento, Saberes y Memoria Afropolitana'),
  heroSubtitle: text('hero_subtitle').default('Un espacio dedicado al directorio de investigadoras y referentes, la difusión de noticias y el reconocimiento histórico de líderes afropolitanos.'),
  heroImageUrl: text('hero_image_url'),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

/* =========================================================================
   Drizzle Relations Definitions
   ========================================================================= */

export const countriesRelations = relations(countries, ({ many }) => ({
  profiles: many(profiles),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  country: one(countries, {
    fields: [profiles.countryId],
    references: [countries.id],
  }),
}));

/* =========================================================================
   Aliases for direct singular imports (Country, Profile, Post, Tribute, SiteSettings)
   ========================================================================= */
export const Country = countries;
export const Profile = profiles;
export const Post = posts;
export const Tribute = tributes;
export const SiteSettings = siteSettings;

/* =========================================================================
   TypeScript Type Inferences
   ========================================================================= */

export type SelectCountry = typeof countries.$inferSelect;
export type InsertCountry = typeof countries.$inferInsert;

export type SelectProfile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

export type SelectPost = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

export type SelectTribute = typeof tributes.$inferSelect;
export type InsertTribute = typeof tributes.$inferInsert;

export type SelectSiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = typeof siteSettings.$inferInsert;
