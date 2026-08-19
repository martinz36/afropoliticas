import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';
import * as schema from './schema';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  console.warn('⚠️ WARNING: DATABASE_URL environment variable is missing.');
}

// Client HTTP de Neon optimizado para la arquitectura serverless / Edge de Next.js
const sql = neon(process.env.DATABASE_URL || '');

// Instancia de Drizzle ORM exportada con el esquema tipado
export const db = drizzle(sql, { schema });

export * from './schema';
