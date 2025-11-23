import z from "zod";
import { Context } from "../../context";
import { verifyEmailSchema } from "../../schema/auth/auth.schema";
import { verifyEmail } from "../../services/auth/verify-email.service";
import { VerifyEmailResponse } from "../../types/auth.types";

export async function VerifyEmailController(
  input: z.infer<typeof verifyEmailSchema>,
  ctx: Context
): Promise<VerifyEmailResponse> {
  if (!input.token) {
    return { success: false, message: "Missing token." };
  }

  try {
    const result = await verifyEmail(input.token);
    return result;
  } catch (error) {
    console.log("error: ", error);
    return { success: false, message: "Something went wrong." };
  }
}
