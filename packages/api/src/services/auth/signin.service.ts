import z from "zod";
import { signinSchema } from "../../schema/auth/auth.schema";
import { SigninResponse } from "../../types/auth.types";
import { Context } from "../../context";
import { auth } from "../../../../../apps/server/src/lib/auth";
import { APIError } from "better-auth/api";
import { checkRateLimit } from "../../middleware/rate-limit";

export type SigninInput = z.infer<typeof signinSchema>;
export async function signInUser(input: SigninInput): Promise<SigninResponse> {
  const validateFields = signinSchema.safeParse({
    email: input.email,
    password: input.password,
  });
  if (!validateFields.success) {
    const tree = z.treeifyError(validateFields.error).properties;
    return {
      success: false,
      message: "Validation failed",
      inputs: { ...input },
      errors: {
        properties: {
          email: tree?.email?.errors,
          password: tree?.password?.errors,
        },
      },
    };
  }

  const { email, password } = validateFields.data;

  try {
    const { headers: responseHeaders } = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      returnHeaders: true,
    });
    const setCookieHeader = responseHeaders.get("set-cookie") || "";
    return {
      success: true,
      message: "Logged in successfully.",
      cookies: setCookieHeader,
      redirectTo: "/feed",
    };
  } catch (error) {
    console.log("error: ", error);
    if (error instanceof APIError) {
      console.log("error message: ", error.message);
      return {
        success: false,
        message: error.message,
        inputs: { ...input },
      };
    }
    return {
      success: false,
      message: "Failed to signin.",
      inputs: { ...input },
    };
  }
}
