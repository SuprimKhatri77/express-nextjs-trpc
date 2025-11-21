import { z } from "zod";
export declare const signupSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
export type SignupInput = z.infer<typeof signupSchema>;
export declare class SignupService {
    execute(input: SignupInput): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        token: string;
    }>;
    private createUser;
    private generateToken;
}
//# sourceMappingURL=signup.service.d.ts.map