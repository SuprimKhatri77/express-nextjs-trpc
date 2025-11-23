import {
  resendVerificationEmailResponseSchema,
  signinResponseSchema,
  signoutResponseSchema,
  signupResponseSchema,
  verifyEmailResponseSchema,
} from "./../types/auth.types";
import { SignupController } from "../controllers/auth/signup.controller";
import {
  resendVerificationEmailSchema,
  signinSchema,
  signupSchema,
  verifyEmailSchema,
} from "../schema/auth/auth.schema";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { SignoutController } from "../controllers/auth/signout.controller";
import { SigninController } from "../controllers/auth/signin.controller";
import { auth } from "../../../../apps/server/src/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { VerifyEmailController } from "../controllers/auth/verify-email.controller";
import { ResendVerificationEmailController } from "../controllers/auth/resend-verification-email.controller";

export const authRouter = router({
  signup: publicProcedure
    .input(signupSchema)
    .output(signupResponseSchema)
    .mutation(async ({ input, ctx }) => {
      return SignupController(input, ctx);
    }),
  signin: publicProcedure
    .input(signinSchema)
    .output(signinResponseSchema)
    .mutation(async ({ input, ctx }) => {
      return SigninController(input, ctx);
    }),
  signout: protectedProcedure
    .output(signoutResponseSchema)
    .mutation(async ({ input, ctx }) => {
      return SignoutController(ctx);
    }),
  getUserSession: publicProcedure.query(async ({ input, ctx }) => {
    return await auth.api.getSession({
      headers: fromNodeHeaders(ctx.req.headers),
    });
  }),
  verifyUserEmail: protectedProcedure
    .input(verifyEmailSchema)
    .output(verifyEmailResponseSchema)
    .mutation(async ({ input, ctx }) => {
      return VerifyEmailController(input, ctx);
    }),
  resendVerificationEmail: protectedProcedure
    .input(resendVerificationEmailSchema)
    .output(resendVerificationEmailResponseSchema)
    .mutation(async ({ input, ctx }) => {
      return ResendVerificationEmailController(input, ctx);
    }),
});
