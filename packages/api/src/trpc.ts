import { Context } from "./context";
import { initTRPC, TRPCError } from "@trpc/server";

type ProtectedContext = Context & {
  userId: string;
};

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in",
    });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    } as ProtectedContext,
  });
});
