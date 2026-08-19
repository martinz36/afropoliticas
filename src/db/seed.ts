import { db, countries, profiles, posts, tributes } from './index';

async function seed() {
  console.log('🌱 Poblando la base de datos de Neon DB con información de prueba...');

  try {
    // 1. Limpiar o insertar Países
    console.log('🌍 Insertando Países...');
    const countriesData = [
      { name: 'Colombia' },
      { name: 'Senegal' },
      { name: 'Nigeria' },
      { name: 'Brasil' },
      { name: 'Ghana' },
      { name: 'Sudáfrica' },
      { name: 'Kenia' },
      { name: 'Francia' },
    ];

    const insertedCountries = await db
      .insert(countries)
      .values(countriesData)
      .returning();

    console.log(`✅ ${insertedCountries.length} Países creados.`);

    // Mapa de nombres de países a IDs creados
    const countryMap = new Map<string, number>();
    insertedCountries.forEach((c) => countryMap.set(c.name, c.id));

    // 2. Insertar Perfiles
    console.log('👥 Insertando Perfiles del Directorio...');
    const profilesData = [
      {
        name: 'Francia Márquez',
        bio: 'Vicepresidenta de la República de Colombia, abogada, activista medioambiental y defensora de los derechos humanos y colectivos de los pueblos afrodescendientes e indígenas.',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
        countryId: countryMap.get('Colombia') || null,
      },
      {
        name: 'Achille Mbembe',
        bio: 'Filósofo, politólogo e historiador camerunés con sede en Sudáfrica. Es una de las figuras más prominentes del pensamiento afro-contemporáneo y pionero del concepto de Afropolitanismo.',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        countryId: countryMap.get('Sudáfrica') || null,
      },
      {
        name: 'Chimamanda Ngozi Adichie',
        bio: 'Reconocida escritora y feminista nigeriana, autora de "Americanah" y "Medio sol amarillo". Su trabajo aborda temas de identidad, migración, raza y equidad de género.',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        countryId: countryMap.get('Nigeria') || null,
      },
      {
        name: 'Lélia Gonzalez',
        bio: 'Intelectual, política, antropóloga y profesora brasileña. Pionera en la articulación entre el feminismo negro y los estudios decoloniales en América Latina.',
        imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80',
        countryId: countryMap.get('Brasil') || null,
      },
      {
        name: 'Manuel Zapata Olivella',
        bio: 'Médico, antropólogo y uno de los escritores afrolatinoamericanos más importantes del siglo XX, autor de la epopeya "Changó, el gran putas".',
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
        countryId: countryMap.get('Colombia') || null,
      },
      {
        name: 'Maryse Condé',
        bio: 'Destacada novelista y académica antillana en lengua francesa, premio Nobel Alternativo de Literatura 2018. Su obra aborda la memoria africana y caribeña.',
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
        countryId: countryMap.get('Francia') || null,
      },
    ];

    const insertedProfiles = await db
      .insert(profiles)
      .values(profilesData)
      .returning();

    console.log(`✅ ${insertedProfiles.length} Perfiles creados.`);

    // 3. Insertar Noticias (Posts)
    console.log('📰 Insertando Noticias y Comunicados...');
    const postsData = [
      {
        title: 'Conferencia Internacional de Pensamiento Afropolitano 2026',
        content: `
          <p>Nos complace anunciar la apertura del simposio internacional de <strong>Pensamiento Afropolitano</strong>, un espacio donde investigadoras, académicas y activistas comunitarias se darán cita para abordar las dinámicas actuales del continente y su diáspora.</p>
          <h3>Ejes Temáticos Centrales</h3>
          <ul>
            <li><strong>Soberanía Epistémica:</strong> Descolonización del conocimiento y archivos de memoria oral.</li>
            <li><strong>Justicia Climática:</strong> El impacto ambiental en comunidades afrodescendientes e indígenas.</li>
            <li><strong>Redes Digitales:</strong> Innovación tecnológica y plataformas afropolitanas de pensamiento abierto.</li>
          </ul>
          <p>El evento contará con paneles magistrales, mesas de trabajo y la presentación de nuevas publicaciones académicas.</p>
        `,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        externalLink: 'https://afropoliticas.org/conferencia-2026',
      },
      {
        title: 'Lanzamiento del Repositorio Digital de Saberes Ancestrales',
        content: `
          <p>Ha sido presentado oficialmente el nuevo <strong>Repositorio Digital de Libre Acceso</strong>, diseñado para la catalogación y preservación de saberes medicinales, musicales y narrativos de las comunidades afrodescendientes.</p>
          <p>Este esfuerzo colaborativo conecta investigadores de América Latina y África Occidental, construyendo un puente de consulta directa para historiadores, estudiantes y público general.</p>
          <blockquote>"Preservar la memoria es un acto activo de dignidad y soberanía colectiva."</blockquote>
        `,
        imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
        externalLink: 'https://afropoliticas.org/repositorio',
      },
      {
        title: 'Publicación de la Antología de Poesía y Literatura Afro-Contemporánea',
        content: `
          <p>Llega a librerías y plataformas digitales la nueva antología que reúne obras literarias, crónicas y ensayos de más de 30 escritoras de Colombia, Brasil, Senegal y Nigeria.</p>
          <p>La edición busca destacar la diversidad de voces afropolitanas que reconfiguran las narrativas sobre identidad, diáspora e historia viva.</p>
        `,
        imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
        externalLink: null,
      },
    ];

    const insertedPosts = await db
      .insert(posts)
      .values(postsData)
      .returning();

    console.log(`✅ ${insertedPosts.length} Noticias creadas.`);

    // 4. Insertar Homenajes (Tributes)
    console.log('🏆 Insertando Homenajes...');
    const tributesData = [
      {
        name: 'Nelson Mandela (1918 - 2013)',
        description: `
          <p>Líder del movimiento anti-apartheid, filántropo, abogado y primer presidente democrático de Sudáfrica. Su vida estuvo consagrada a la lucha contra el racismo institucionalizado y a la promoción de los derechos humanos en el mundo entero.</p>
          <p>Su visión de perdón, reconciliación y dignidad humana continúa siendo un faro inagotable para las causas de justicia social globales.</p>
        `,
        imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Frantz Fanon (1925 - 1961)',
        description: `
          <p>Pensador, psiquiatra, filósofo y ensayista antillano originario de Martinica. Sus obras cumbre, <em>"Piel negra, máscaras blancas"</em> y <em>"Los condenados de la tierra"</em>, transformaron radicalmente la comprensión sobre las secuelas psicológicas y sociales del colonialismo.</p>
          <p>Su análisis sigue siendo pilar fundamental en la teoría descolonial y la lucha por la liberación de los pueblos subordinados.</p>
        `,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Wangari Maathai (1940 - 2011)',
        description: `
          <p>Bióloga, activista política y ecologista keniana. Fundadora del legendario <strong>Movimiento Cinturón Verde</strong> y primera mujer africana en ser galardonada con el Premio Nobel de la Paz por sus aportes al desarrollo sostenible, la democracia y los derechos de las mujeres.</p>
        `,
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Manuel Zapata Olivella (1920 - 2004)',
        description: `
          <p>Escritor, médico, antropólogo y folclorista colombiano. Considerado uno de los representantes fundamentales de la literatura afrolatinoamericana. Su monumental novela <em>"Changó, el gran putas"</em> inmortalizó el recorrido mítico e histórico de la diáspora africana en América.</p>
        `,
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      },
    ];

    const insertedTributes = await db
      .insert(tributes)
      .values(tributesData)
      .returning();

    console.log(`✅ ${insertedTributes.length} Homenajes creados.`);

    console.log('🎉 ¡Población de datos finalizada con éxito en Neon DB!');
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
}

seed();
