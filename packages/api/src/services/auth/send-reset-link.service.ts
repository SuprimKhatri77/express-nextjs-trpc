import z from "zod";
import { sendResetPasswordLinkSchema } from "../../schema/auth/auth.schema";
import { SendResetPasswordLinkResponse } from "../../types/auth.types";
import { auth } from "../../../../../apps/server/src/lib/auth";
import { APIError } from "better-auth/api";

export async function sendResetPasswordLink(
  input: z.infer<typeof sendResetPasswordLinkSchema>
): Promise<SendResetPasswordLinkResponse> {
  try {
    await auth.api.requestPasswordReset({
      body: {
        email: input.email,
      },
    });
    return { success: true, message: "Reset password link sent successfully." };
  } catch (error) {
    console.log("error: ", error);
    if (error instanceof APIError) {
      console.log("error message: ", error.message);
      return { success: false, message: error.message, inputs: { ...input } };
    }
    return {
      success: false,
      message: "Failed to send reset password link.",
      inputs: { ...input },
    };
  }
}
