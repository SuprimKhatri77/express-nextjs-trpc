import z from "zod";
import { resendVerificationEmailSchema } from "../../schema/auth/auth.schema";
import { ResendVerificationEmailResponse } from "../../types/auth.types";
import { auth } from "../../../../../apps/server/src/lib/auth";
import { APIError } from "better-auth/api";

export async function resendVerificaitonEmail(
  input: z.infer<typeof resendVerificationEmailSchema>
): Promise<ResendVerificationEmailResponse> {
  const validateInput = resendVerificationEmailSchema.safeParse({
    email: input.email,
  });
  if (!validateInput.success) {
    return {
      success: false,
      message: "Validation failed.",
      inputs: { ...input },
      errors: {
        properties: {
          email: z.treeifyError(validateInput.error).properties?.email?.errors,
        },
      },
    };
  }
  const { email } = validateInput.data;
  try {
    await auth.api.sendVerificationEmail({
      body: {
        email,
      },
    });
    return { success: true, message: "Verification Email is sent." };
  } catch (error) {
    console.log("error: ", error);
    if (error instanceof APIError) {
      console.log("error message: ", error.message);
      return {
        success: false,
        message: error.message,
      };
    }
    return { success: false, message: "Failed to send verificaiton email." };
  }
}
