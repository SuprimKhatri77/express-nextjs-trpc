import z from "zod";
import { signinSchema } from "../../schema/auth/auth.schema";
import { Context } from "../../context";
import { signInUser } from "../../services/auth/signin.service";
import { checkRateLimit } from "../../middleware/rate-limit";

export async function SigninController(
  input: z.infer<typeof signinSchema>,
  ctx: Context
) {
  const email = input.email;
  try {
    await checkRateLimit(
      ctx,
      {
        keyPrefix: "login", // Namespace for this rate limit
        maxAttempts: 2, // 5 login attempts
        windowSeconds: 120, // Per 15 minutes (900 seconds)
        blockDurationSeconds: 60, // Block for 30 minutes after exceeding
        useEmail: true, // Rate limit by email (not IP)
        useSlidingWindow: true, // Use accurate sliding window
      },
      email // Pass email for rate limiting
    );
  } catch (error) {
    // Rate limit exceeded - return error to user

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
        inputs: { ...input },
      };
    }
    throw error;
  }
  const result = await signInUser(input);
  if (result.success && result.cookies) {
    ctx.res.setHeader("Set-Cookie", result.cookies);
  }
  return result;
}
