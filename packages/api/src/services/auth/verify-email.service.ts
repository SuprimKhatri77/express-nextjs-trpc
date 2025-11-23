import { APIError } from "better-auth/api";
import { auth } from "../../../../../apps/server/src/lib/auth";
import { VerifyEmailResponse } from "../../types/auth.types";

export async function verifyEmail(token: string): Promise<VerifyEmailResponse> {
  try {
    await auth.api.verifyEmail({
      query: {
        token,
      },
    });

    return { success: true, message: "Email verified successfully." };
  } catch (error) {
    console.log("error: ", error);
    if (error instanceof APIError) {
      console.log("error message: ", error.message);
      return { success: false, message: error.message };
    }
    return { success: false, message: "Failed to verify email." };
  }
}
