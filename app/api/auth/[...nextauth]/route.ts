import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { Session, User, SessionStrategy} from 'next-auth';
import type { JWT } from 'next-auth/jwt';

import { prisma } from '@/lib/prisma';


// configure auth with mocked credentials
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (user) {
          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt' as SessionStrategy,
  },
  callbacks: {
    // attach user id to session
    async session({ session, token }: { session: Session; token: JWT }) {
        if (token && session.user) {
          session.user.id = token.id as string;
        }
        return session;
    },
    // attach user id to jwt
    async jwt({ token, user }: { token: JWT; user?: User }) {
        if (user) {
          token.id = user.id as string;
        }
        return token;
    },  
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
