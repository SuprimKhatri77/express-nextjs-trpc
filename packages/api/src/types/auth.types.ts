import z from "zod";

export const signupResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  redirectTo: z.string().optional(),
  cookies: z.string().optional(),
  inputs: z
    .object({
      name: z.string(),
      email: z.email(),
      password: z.string(),
    })
    .optional(),
  errors: z
    .object({
      properties: z
        .object({
          name: z.array(z.string()).optional(),
          email: z.array(z.string()).optional(),
          password: z.array(z.string()).optional(),
        })
        .optional(),
    })
    .optional(),
});

export const signinResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  redirectTo: z.string().optional(),
  cookies: z.string().optional(),
  inputs: z
    .object({
      email: z.email(),
      password: z.string(),
    })
    .optional(),
  errors: z
    .object({
      properties: z
        .object({
          email: z.array(z.string()).optional(),
          password: z.array(z.string()).optional(),
        })
        .optional(),
    })
    .optional(),
});

export const signoutResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const verifyEmailResponseSchema = z.object({
  success: z.boolean().nonoptional(),
  message: z.string().nonempty(),
});

export const resendVerificationEmailResponseSchema = z.object({
  success: z.boolean().nonoptional(),
  message: z.string().trim().nonempty(),
  inputs: z
    .object({
      email: z.email(),
    })
    .optional(),
  errors: z
    .object({
      properties: z
        .object({
          email: z.array(z.string()).optional(),
        })
        .optional(),
    })
    .optional(),
});

export const sendResetPasswordLinkResponseSchema = z.object({
  success: z.boolean().nonoptional(),
  message: z.string().trim().nonempty(),
  inputs: z
    .object({
      email: z.email(),
    })
    .optional(),
  errors: z
    .object({
      properties: z
        .object({
          email: z.array(z.string()).optional(),
        })
        .optional(),
    })
    .optional(),
});

export const resetPasswordResponseSchema = z.object({
  success: z.boolean().nonoptional(),
  message: z.string().trim().nonempty(),
  inputs: z
    .object({
      newPassword: z.string(),
      token: z.string(),
    })
    .optional(),
  errors: z
    .object({
      properties: z
        .object({
          newPassword: z.array(z.string()).optional(),
          token: z.array(z.string()).optional(),
        })
        .optional(),
    })
    .optional(),
  redirectTo: z.string().trim().optional(),
});

export const verifyResetPasswordTokenResponseSchema = z.object({
  success: z.boolean().nonoptional(),
  message: z.string().trim().nonempty(),
});

export type SignupResponse = z.infer<typeof signupResponseSchema>;
export type SignoutResponse = z.infer<typeof signoutResponseSchema>;
export type SigninResponse = z.infer<typeof signinResponseSchema>;
export type VerifyEmailResponse = z.infer<typeof verifyEmailResponseSchema>;
export type ResendVerificationEmailResponse = z.infer<
  typeof resendVerificationEmailResponseSchema
>;
export type SendResetPasswordLinkResponse = z.infer<
  typeof sendResetPasswordLinkResponseSchema
>;

export type ResetPasswordResponse = z.infer<typeof resetPasswordResponseSchema>;
export type VerifyResetPasswordTokenResponse = z.infer<
  typeof verifyResetPasswordTokenResponseSchema
>;
