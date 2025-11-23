import z from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(3).max(20).nonempty(),
  email: z.email().nonempty(),
  password: z.string().trim().min(5).max(30).nonempty(),
});

export const signinSchema = z.object({
  email: z.email().nonempty(),
  password: z.string().trim().nonempty(),
});

export const verifyEmailSchema = z.object({
  token: z.string(),
});

export const resendVerificationEmailSchema = z.object({
  email: z.email().nonempty(),
});
