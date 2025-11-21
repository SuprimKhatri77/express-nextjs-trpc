import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../../../../apps/server/src/lib/auth";
import { APIError } from "better-auth";
import { SignoutResponse } from "../../types/auth.types";

export async function signOutUser(
  headers: ReturnType<typeof fromNodeHeaders>
): Promise<SignoutResponse> {
  try {
    await auth.api.signOut({
      headers,
    });
    return { success: true, message: "Signed out successfully." };
  } catch (error) {
    console.log("error: ", error);
    if (error instanceof APIError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Failed to signout." };
  }
}
