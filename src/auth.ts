import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Administrador',
      credentials: {
        email: { label: 'Correo electrónico', type: 'email', placeholder: 'admin@afropoliticas.org' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@afropoliticas.org';
        const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecretPass2026!';

        if (
          typeof credentials?.email === 'string' &&
          typeof credentials?.password === 'string' &&
          credentials.email.trim().toLowerCase() === adminEmail.trim().toLowerCase() &&
          credentials.password === adminPassword
        ) {
          return {
            id: 'admin-1',
            name: 'Administrador Afropolíticas',
            email: adminEmail,
            role: 'admin',
          };
        }

        // Si la validación falla
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || 'admin';
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
