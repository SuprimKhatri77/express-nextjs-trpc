import { router } from "../trpc";
import { authRouter } from "./auth.router";
import { postRouter } from "./post.router";

export const appRouter = router({
  auth: authRouter,
  post: postRouter,
});
export type AppRouter = typeof appRouter;
