import { SendResetPasswordLinkResponse } from "./../../types/auth.types";
import z from "zod";
import { sendResetPasswordLinkSchema } from "../../schema/auth/auth.schema";
import { Context } from "../../context";
import { sendResetPasswordLink } from "../../services/auth/send-reset-link.service";

export async function SendResetPasswordLinkController(
  input: z.infer<typeof sendResetPasswordLinkSchema>,
  ctx: Context
): Promise<SendResetPasswordLinkResponse> {
  const validateInput = sendResetPasswordLinkSchema.safeParse({
    email: input.email,
  });
  if (!validateInput.success) {
    return {
      success: false,
      message: "Validation failed",
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
    const result = await sendResetPasswordLink({ email });
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
