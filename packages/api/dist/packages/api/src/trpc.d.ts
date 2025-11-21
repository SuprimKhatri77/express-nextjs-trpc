export declare const router: import("@trpc/server").TRPCRouterBuilder<{
    ctx: import("../../../apps/server/src/context").AppContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}>;
export declare const publicProcedure: import("@trpc/server").TRPCProcedureBuilder<import("../../../apps/server/src/context").AppContext, object, object, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const protectedProcedure: import("@trpc/server").TRPCProcedureBuilder<import("../../../apps/server/src/context").AppContext, object, {
    userId: string;
    req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    res: import("express").Response<any, Record<string, any>>;
    db: import("drizzle-orm/neon-http").NeonHttpDatabase<typeof import("../../../apps/server/src/db/schema")> & {
        $client: import("@neondatabase/serverless").NeonQueryFunction<false, false>;
    };
    setHeader: (name: string, value: string | string[]) => void;
    getHeader: (name: string) => string | string[] | undefined;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
//# sourceMappingURL=trpc.d.ts.map