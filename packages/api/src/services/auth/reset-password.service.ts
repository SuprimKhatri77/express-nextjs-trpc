import z from "zod";
import { ResetPasswordResponse } from "../../types/auth.types";
import { resetPasswordSchema } from "../../schema/auth/auth.schema";
import { auth } from "../../../../../apps/server/src/lib/auth";
import { APIError } from "better-auth/api";

export async function resetPassword(
  input: z.infer<typeof resetPasswordSchema>
): Promise<ResetPasswordResponse> {
  try {
    await auth.api.resetPassword({
      body: {
        token: input.token,
        newPassword: input.newPassword,
      },
    });
    return {
      success: true,
      message:
        "Your password has been successfully reset. Please sign in with your new password",
      redirectTo: "/login",
    };
  } catch (error) {
    console.log("error: ", error);
    if (error instanceof APIError) {
      console.log("error message: ", error.message);
      return { success: false, message: error.message, inputs: { ...input } };
    }
    return {
      success: false,
      message: "Failed to reset password.",
      inputs: { ...input },
    };
  }
}
