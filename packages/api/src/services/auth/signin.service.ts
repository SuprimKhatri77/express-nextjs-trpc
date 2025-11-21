import z from "zod";
import { signinSchema } from "../../schema/auth.schema";
import { SigninResponse } from "../../types/auth.types";
import { Context } from "../../../../../apps/server/src/context";
import { auth } from "../../../../../apps/server/src/lib/auth";
import { APIError } from "better-auth/api";

export type SigninInput = z.infer<typeof signinSchema>;
export async function signInUser(input: SigninInput): Promise<SigninResponse> {
  const validateFileds = signinSchema.safeParse({
    email: input.email,
    password: input.password,
  });
  if (!validateFileds.success) {
    const tree = z.treeifyError(validateFileds.error).properties;
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

  const { email, password } = validateFileds.data;
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
      redirectTo: "/dashboard",
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
