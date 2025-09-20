/**
 * tRPC client configuration for Cars.na
 */
import { createTRPCReact } from '@trpc/react-query';
import { type AppRouter } from '@/server/routers/_app';

export const trpc = createTRPCReact<AppRouter>();