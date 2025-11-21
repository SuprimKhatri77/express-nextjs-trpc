import z from "zod";
import { Context } from "../../trpc";
import { signupSchema } from "../../services/auth/signup.service";
export declare function SignupController(input: z.infer<typeof signupSchema>, ctx: Context): Promise<{
    user: {
        id: string;
        email: string;
        name: string;
    };
    token: any;
}>;
export { signupSchema };
//# sourceMappingURL=signup.controller.d.ts.map