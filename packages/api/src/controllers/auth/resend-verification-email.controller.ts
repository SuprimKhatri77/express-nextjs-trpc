import z from "zod";
import { resendVerificationEmailSchema } from "../../schema/auth/auth.schema";
import { Context } from "../../context";
import { ResendVerificationEmailResponse } from "../../types/auth.types";
import { resendVerificaitonEmail } from "../../services/auth/resend-verification-email.service";

export async function ResendVerificationEmailController(
  input: z.infer<typeof resendVerificationEmailSchema>,
  ctx: Context
): Promise<ResendVerificationEmailResponse> {
  try {
    const result = await resendVerificaitonEmail(input);
    return result;
  } catch (error) {
    console.log("error: ", error);
    return { success: false, message: "Something went wrong." };
  }
}
