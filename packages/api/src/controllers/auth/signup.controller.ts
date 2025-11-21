import { signupSchema } from "./../../schema/auth.schema";
import z from "zod";
import { signupUser } from "../../services/auth/signup.service";
import { Context } from "../../../../../apps/server/src/context";
import { TRPCError } from "@trpc/server";
import { SignupResponse } from "../../types/auth.types";

export async function SignupController(
  input: z.infer<typeof signupSchema>,
  ctx: Context
): Promise<SignupResponse> {
  console.log("Signup attempt:", input.email);
  try {
    const result = await signupUser(input);
    if (result.success && result.cookies) {
      ctx.setHeader("Set-Cookie", result.cookies);
    }
    return result;
  } catch (error) {
    console.error("[AUTH] Signup controller error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred during signup",
    });
  }
}
