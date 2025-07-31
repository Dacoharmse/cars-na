/**
 * tRPC API route handler for Next.js App Router
 */
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers/_app';
import { prisma } from '@/lib/prisma';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({
      prisma,
      session: null, // We'll handle auth later
      req: null as any,
      res: null as any,
    }),
  });

export { handler as GET, handler as POST };
