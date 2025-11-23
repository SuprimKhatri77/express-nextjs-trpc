import { fromNodeHeaders } from "better-auth/node";
import { Context } from "../../context";
import { signOutUser } from "../../services/auth/signout.service";
import { SignoutResponse } from "../../types/auth.types";

export async function SignoutController(
  ctx: Context
): Promise<SignoutResponse> {
  const headers = fromNodeHeaders(ctx.req.headers);
  try {
    const result = await signOutUser(headers);
    if (result.success) {
      ctx.res.clearCookie("better-auth.session_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }
    return result;
  } catch (error) {
    console.log("error: ", error);
    return { success: false, message: "Something went wrong." };
  }
}
