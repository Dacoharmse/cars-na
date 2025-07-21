/**
 * Main tRPC router for Cars.na
 */
import { router } from "../trpc";
import { userRouter } from "./user";
import { dealershipRouter } from "./dealership";
import { vehicleRouter } from "./vehicle";

export const appRouter = router({
  user: userRouter,
  dealership: dealershipRouter,
  vehicle: vehicleRouter,
});

export type AppRouter = typeof appRouter;
