import z from "zod";
import { signinSchema } from "../../schema/auth.schema";
import { Context } from "../../../../../apps/server/src/context";
import { signInUser } from "../../services/auth/signin.service";

export async function SigninController(
  input: z.infer<typeof signinSchema>,
  ctx: Context
) {
  const result = await signInUser(input);
  if (result.success && result.cookies) {
    ctx.res.setHeader("Set-Cookie", result.cookies);
  }
  return result;
}
