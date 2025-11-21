import { signupUser } from "../../services/auth/signup.service";
import { TRPCError } from "@trpc/server";
export async function SignupController(input, ctx) {
    console.log("Signup attempt:", input.email);
    try {
        const result = await signupUser(input);
        if (result.success && result.cookies) {
            ctx.setHeader("Set-Cookie", result.cookies);
        }
        return result;
    }
    catch (error) {
        console.error("[AUTH] Signup controller error:", error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred during signup",
        });
    }
}
