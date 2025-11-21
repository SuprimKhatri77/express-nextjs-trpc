// packages/api/src/routers/post.router.ts
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
export const postRouter = router({
    // Anyone can read posts
    getAll: publicProcedure.query(({ ctx }) => {
        // ctx.userId might be undefined here
        return { posts: [] };
    }),
    // Only authenticated users can create posts
    create: protectedProcedure
        .input(z.object({
        title: z.string(),
        content: z.string(),
    }))
        .mutation(({ input, ctx }) => {
        // ctx.userId is GUARANTEED to exist here (TypeScript knows!)
        return {
            id: "1",
            ...input,
            authorId: ctx.userId, // ✅ Type-safe!
        };
    }),
});
