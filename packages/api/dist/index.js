import { router } from "./trpc";
import { authRouter } from "./routers/auth.router";
export const appRouter = router({
    auth: authRouter,
});
