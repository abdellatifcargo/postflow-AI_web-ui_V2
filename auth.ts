import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { z } from "zod";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        tenantSlug: { label: "Tenant", type: "text" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
            tenantSlug: z.string().min(1),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password, tenantSlug } = parsedCredentials.data;

        const tenant = await prisma.tenant.findUnique({
          where: { slug: tenantSlug },
        });

        if (!tenant) return null;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || user.tenantId !== tenant.id) return null;

        const passwordMatch = await bcryptjs.compare(password, user.password);

        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // Get tenant info
        const user = await prisma.user.findUnique({
          where: { id: token.id as string },
          include: { tenant: true },
        });
        if (user) {
          (session.user as any).tenantId = user.tenantId;
          (session.user as any).tenantSlug = user.tenant.slug;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
