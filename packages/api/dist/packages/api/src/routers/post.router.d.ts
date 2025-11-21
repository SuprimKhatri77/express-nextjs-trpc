export declare const postRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../../../../apps/server/src/context").AppContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    getAll: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            posts: never[];
        };
        meta: object;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            title: string;
            content: string;
        };
        output: {
            authorId: string;
            title: string;
            content: string;
            id: string;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=post.router.d.ts.map