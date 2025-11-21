import { signInUser } from "../../services/auth/signin.service";
export async function SigninController(input, ctx) {
    const result = await signInUser(input);
    if (result.success && result.cookies) {
        ctx.res.setHeader("Set-Cookie", result.cookies);
    }
    return result;
}
