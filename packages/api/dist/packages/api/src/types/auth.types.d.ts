import z from "zod";
export declare const signupResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
    redirectTo: z.ZodOptional<z.ZodString>;
    cookies: z.ZodOptional<z.ZodString>;
    inputs: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        email: z.ZodEmail;
        password: z.ZodString;
    }, z.core.$strip>>;
    errors: z.ZodOptional<z.ZodObject<{
        properties: z.ZodOptional<z.ZodObject<{
            name: z.ZodOptional<z.ZodArray<z.ZodString>>;
            email: z.ZodOptional<z.ZodArray<z.ZodString>>;
            password: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const signinResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
    redirectTo: z.ZodOptional<z.ZodString>;
    cookies: z.ZodOptional<z.ZodString>;
    inputs: z.ZodOptional<z.ZodObject<{
        email: z.ZodEmail;
        password: z.ZodString;
    }, z.core.$strip>>;
    errors: z.ZodOptional<z.ZodObject<{
        properties: z.ZodOptional<z.ZodObject<{
            email: z.ZodOptional<z.ZodArray<z.ZodString>>;
            password: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const signoutResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
}, z.core.$strip>;
export type SignupResponse = z.infer<typeof signupResponseSchema>;
export type SignoutResponse = z.infer<typeof signoutResponseSchema>;
export type SigninResponse = z.infer<typeof signinResponseSchema>;
//# sourceMappingURL=auth.types.d.ts.map