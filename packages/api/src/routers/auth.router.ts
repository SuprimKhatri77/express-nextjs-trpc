import {
  signinResponseSchema,
  signoutResponseSchema,
  signupResponseSchema,
} from "./../types/auth.types";
import { SignupController } from "../controllers/auth/signup.controller";
import { signinSchema, signupSchema } from "../schema/auth.schema";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { SignoutController } from "../controllers/auth/signout.controller";
import { SigninController } from "../controllers/auth/signin.controller";

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
});
