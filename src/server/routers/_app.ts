/**
 * Main tRPC router for Cars.na
 */
import { router } from "../trpc";
import { userRouter } from "./user";
import { dealershipRouter } from "./dealership";
import { vehicleRouter } from "./vehicle";
import { leadRouter } from "./lead";
import { showcaseRouter } from "../api/routers/showcase";
import { analyticsRouter } from "./analytics";
import { subscriptionRouter } from "./subscription";

export const appRouter = router({
  user: userRouter,
  dealership: dealershipRouter,
  vehicle: vehicleRouter,
  lead: leadRouter,
  showcase: showcaseRouter,
  analytics: analyticsRouter,
  subscription: subscriptionRouter,
});

export type AppRouter = typeof appRouter;
