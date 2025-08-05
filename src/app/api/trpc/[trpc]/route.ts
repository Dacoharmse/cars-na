/**
 * tRPC API route handler for Next.js App Router
 */
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers/_app';
import { createTRPCContext } from '@/server/trpc';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: ({ req, resHeaders }) => 
      createTRPCContext({ 
        req: req as any, 
        res: { setHeader: (name: string, value: string) => resHeaders?.set(name, value) } as any 
      }),
  });

export { handler as GET, handler as POST };
