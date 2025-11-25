import z from "zod";
import { resetPasswordSchema } from "../../schema/auth/auth.schema";
import { Context } from "../../context";
import { ResetPasswordResponse } from "../../types/auth.types";
import { resetPassword } from "../../services/auth/reset-password.service";

export async function ResetPasswordController(
  input: z.infer<typeof resetPasswordSchema>,
  ctx: Context
): Promise<ResetPasswordResponse> {
  const validateInput = resetPasswordSchema.safeParse({
    newPassword: input.newPassword,
    token: input.token,
  });

  if (!validateInput.success) {
    return {
      success: false,
      message: "Validation Failed.",
      inputs: { ...input },
      errors: {
        properties: {
          newPassword: z.treeifyError(validateInput.error).properties
            ?.newPassword?.errors,
          token: z.treeifyError(validateInput.error).properties?.token?.errors,
        },
      },
    };
  }

  const { token, newPassword } = validateInput.data;
  try {
    const result = await resetPassword({ token, newPassword });
    return result;
  } catch (error) {
    console.log("error: ", error);
    return {
      success: false,
      message: "Something went wrong.",
      inputs: { ...input },
    };
  }
}
