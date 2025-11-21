export declare const authRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../../../../apps/server/src/context").AppContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    signup: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
            email: string;
            password: string;
        };
        output: {
            success: boolean;
            message: string;
            redirectTo?: string | undefined;
            cookies?: string | undefined;
            inputs?: {
                name: string;
                email: string;
                password: string;
            } | undefined;
            errors?: {
                properties?: {
                    name?: string[] | undefined;
                    email?: string[] | undefined;
                    password?: string[] | undefined;
                } | undefined;
            } | undefined;
        };
        meta: object;
    }>;
    signin: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            email: string;
            password: string;
        };
        output: {
            success: boolean;
            message: string;
            redirectTo?: string | undefined;
            cookies?: string | undefined;
            inputs?: {
                email: string;
                password: string;
            } | undefined;
            errors?: {
                properties?: {
                    email?: string[] | undefined;
                    password?: string[] | undefined;
                } | undefined;
            } | undefined;
        };
        meta: object;
    }>;
    signout: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=auth.router.d.ts.map