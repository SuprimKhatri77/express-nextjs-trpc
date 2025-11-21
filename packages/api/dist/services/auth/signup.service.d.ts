import { z } from "zod";
export declare const signupSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
export type SignupInput = z.infer<typeof signupSchema>;
export declare function signupUser(input: SignupInput): Promise<{
    user: {
        id: string;
        email: string;
        name: string;
    };
    token: any;
}>;
//# sourceMappingURL=signup.service.d.ts.map