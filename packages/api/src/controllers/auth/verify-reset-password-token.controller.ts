import z from "zod";
import { verifyResetPasswordTokenSchema } from "../../schema/auth/auth.schema";
import { Context } from "../../context";
import { VerifyResetPasswordTokenResponse } from "../../types/auth.types";
import { verifyResetPasswordToken } from "../../services/auth/verify-reset-password-token.service";

export async function VerifyResetPasswordTokenController(
  input: z.infer<typeof verifyResetPasswordTokenSchema>,
  ctx: Context
): Promise<VerifyResetPasswordTokenResponse> {
  const validateInput = verifyResetPasswordTokenSchema.safeParse({
    token: input.token,
  });
  if (!validateInput.success) {
    return { success: false, message: "Invalid token type." };
  }
  const { token } = validateInput.data;
  try {
    const result = await verifyResetPasswordToken({ token });
    return result;
  } catch (error) {
    console.log("error: ", error);
    return { success: false, message: "Something went wrong." };
  }
}
