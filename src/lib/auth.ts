/**
 * NextAuth.js configuration for Cars.na
 */
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "./prisma";
import { emailService } from "./email";

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma), // Disabled for development
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user in database
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
            include: {
              dealership: true,
            },
          });

          if (!user) {
            return null;
          }

          // Check if password matches
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordMatch) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            dealershipId: user.dealershipId,
            image: user.image,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Send login notification email when user successfully signs in
      if (user && user.email) {
        try {
          await emailService.sendLoginNotification(
            {
              name: user.name || 'User',
              email: user.email,
            },
            {
              // In production, you can get these from the request headers
              ip: 'N/A', // req.ip in production
              location: 'N/A', // Can be determined from IP
              device: 'N/A', // Can be parsed from user-agent
            }
          );
        } catch (error) {
          console.error('Failed to send login notification:', error);
          // Don't block login if email fails
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.dealershipId = (user as any).dealershipId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).dealershipId = token.dealershipId as string;
      }
      return session;
    },
  },
};
