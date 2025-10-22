/**
 * NextAuth.js configuration for Cars.na
 */
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "./prisma";
import { sendWelcomeEmail, sendLoginNotificationEmail } from "./email-helpers";

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma), // Disabled for development
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/dealer/login",
    error: "/dealer/login",
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
          // Check for hardcoded admin user for development
          if (credentials.email === 'admin@cars.na' && (credentials.password === 'admin123' || credentials.password === 'admin@cars2025')) {
            return {
              id: 'admin-001',
              name: 'System Administrator',
              email: 'admin@cars.na',
              role: 'ADMIN',
              dealershipId: null,
              image: null,
            };
          }

          // Check for hardcoded dealer users for development
          if (credentials.email === 'dealer@premium-motors.com' && credentials.password === 'dealer123') {
            return {
              id: 'dealer-001',
              name: 'Premium Motors Manager',
              email: 'dealer@premium-motors.com',
              role: 'DEALER_PRINCIPAL',
              dealershipId: 'dealership-001',
              image: null,
            };
          }

          if (credentials.email === 'dealer@citycars.na' && credentials.password === 'dealer123') {
            return {
              id: 'dealer-002',
              name: 'City Cars Manager',
              email: 'dealer@citycars.na',
              role: 'DEALER_PRINCIPAL',
              dealershipId: 'dealership-002',
              image: null,
            };
          }

          if (credentials.email === 'sales@citycars.na' && credentials.password === 'sales123') {
            return {
              id: 'sales-001',
              name: 'Sales Executive',
              email: 'sales@citycars.na',
              role: 'SALES_EXECUTIVE',
              dealershipId: 'dealership-002',
              image: null,
            };
          }

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

          // Fallback for admin user if database is not available
          if (credentials.email === 'admin@cars.na' && credentials.password === 'admin@cars2025') {
            return {
              id: 'admin-001',
              name: 'System Administrator',
              email: 'admin@cars.na',
              role: 'ADMIN',
              dealershipId: null,
              image: null,
            };
          }

          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        // Send login notification for database users (not hardcoded admin)
        if (user && user.email && user.email !== 'admin@cars.na') {
          // Extract basic login details (in production, you'd get these from request headers)
          const loginDetails = {
            device: 'Web Browser',
            location: 'Namibia'
          };

          // Send login notification email (non-blocking)
          sendLoginNotificationEmail(
            {
              name: user.name || 'User',
              email: user.email,
              id: user.id || ''
            },
            loginDetails
          ).catch(error => {
            console.error('Failed to send login notification:', error);
          });
        }

        console.log('User signed in:', user?.email);
        return true;
      } catch (error) {
        console.error('Sign-in callback error:', error);
        return true; // Don't block login due to email issues
      }
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
