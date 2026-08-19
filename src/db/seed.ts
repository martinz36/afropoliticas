import { db, countries, profiles, posts, tributes } from './index';

/**
 * Script de prueba / ejemplo para interactuar con la base de datos Neon + Drizzle.
 * Muestra el uso de los métodos de inserción y consulta tipados.
 */
async function main() {
  console.log('🌱 Demostración de tipos y consultas Drizzle ORM...');

  // 1. Insertar un país de prueba
  const newCountry = await db
    .insert(countries)
    .values({ name: 'Colombia' })
    .returning();
  console.log('País creado:', newCountry);

  // 2. Insertar un perfil asociado
  if (newCountry.length > 0) {
    const newProfile = await db
      .insert(profiles)
      .values({
        name: 'Ana Silva',
        bio: 'Investigadora y escritora sobre cultura afropolitana',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        countryId: newCountry[0].id,
      })
      .returning();
    console.log('Perfil creado:', newProfile);
  }

  // 3. Insertar una noticia (Post)
  const newPost = await db
    .insert(posts)
    .values({
      title: 'Lanzamiento del Portal Afropolíticas',
      content: 'Un espacio para la visibilización de saberes, memoria e iniciativas de impacto.',
      imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c',
      externalLink: 'https://afropolíticas.org',
    })
    .returning();
  console.log('Noticia creada:', newPost);

  // 4. Insertar un homenaje (Tribute)
  const newTribute = await db
    .insert(tributes)
    .values({
      name: 'Manuel Zapata Olivella',
      description: 'Médico, antropólogo y uno de los más importantes representantes de la literatura afrocolombiana.',
      imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
    })
    .returning();
  console.log('Homenaje creado:', newTribute);

  console.log('✨ Operación de prueba finalizada.');
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Error al ejecutar seed script:', err);
    process.exit(1);
  });
}
