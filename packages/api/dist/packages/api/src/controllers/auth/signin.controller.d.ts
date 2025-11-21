import z from "zod";
import { signinSchema } from "../../schema/auth.schema";
import { Context } from "../../../../../apps/server/src/context";
export declare function SigninController(input: z.infer<typeof signinSchema>, ctx: Context): Promise<{
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
}>;
//# sourceMappingURL=signin.controller.d.ts.map