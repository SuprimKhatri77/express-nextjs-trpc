import { auth } from "./../../../../../apps/server/src/lib/auth";
import { z } from "zod";
import { signupSchema } from "../../schema/auth/auth.schema";
import { SignupResponse } from "../../types/auth.types";

export type SignupInput = z.infer<typeof signupSchema>;

export async function signupUser(input: SignupInput): Promise<SignupResponse> {
  const validateFields = signupSchema.safeParse({
    name: input.name,
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
          name: tree?.name?.errors,
          email: tree?.email?.errors,
          password: tree?.password?.errors,
        },
      },
    };
  }
  const { name, email, password } = validateFields.data;
  try {
    const { headers: repsonseHeaders } = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        rememberMe: true,
      },
      returnHeaders: true,
    });
    const setCookieHeader = repsonseHeaders.get("set-cookie") || "";

    return {
      success: true,
      message: "Signed up successfully.",
      redirectTo: `/verify-email?from=${encodeURIComponent(
        "signup"
      )}&context=${encodeURIComponent("verify email")}`,
      cookies: setCookieHeader,
    };
  } catch (error: any) {
    console.log("error: ", error);
    return {
      success: false,
      message: error.message || "Signup failed.",
      inputs: { ...input },
    };
  }
}
