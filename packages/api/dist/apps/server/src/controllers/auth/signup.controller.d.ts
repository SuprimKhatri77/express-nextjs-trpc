import z from "zod";
import { signupSchema } from "../../services/auth/signup.service";
import type { Context } from "../../trpc/context";
export declare function handleSignup(input: z.infer<typeof signupSchema>, ctx: Context): Promise<any>;
export { signupSchema };
//# sourceMappingURL=signup.controller.d.ts.map