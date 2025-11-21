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

export type SignupResponse = z.infer<typeof signupResponseSchema>;
export type SignoutResponse = z.infer<typeof signoutResponseSchema>;
export type SigninResponse = z.infer<typeof signinResponseSchema>;
