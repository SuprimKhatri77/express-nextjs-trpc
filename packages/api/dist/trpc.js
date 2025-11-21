import { initTRPC, TRPCError } from "@trpc/server";
const t = initTRPC.context().create();
export const router = t.router;
export const publicProcedure = t.procedure;
// Protected procedure (auth required) - like your middleware!
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
    if (!ctx.userId) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in",
        });
    }
    // Pass userId to next procedure (now it's guaranteed to exist)
    return next({
        ctx: {
            ...ctx,
            userId: ctx.userId, // TypeScript now knows this is NOT undefined
        },
    });
});
