export declare const appRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("./trpc").Context;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    auth: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./trpc").Context;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        signup: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email: string;
                password: string;
                name: string;
            };
            output: {
                user: {
                    id: string;
                    email: string;
                    name: string;
                };
                token: any;
            };
            meta: object;
        }>;
        login: import("@trpc/server").TRPCMutationProcedure<{
            input: any;
            output: any;
            meta: object;
        }>;
    }>>;
}>>;
export type AppRouter = typeof appRouter;
//# sourceMappingURL=index.d.ts.map