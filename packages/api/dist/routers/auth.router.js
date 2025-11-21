import { SignupController } from "../controllers/auth/signup.controller";
import { signupSchema } from "../services/auth/signup.service";
import { router, publicProcedure } from "../trpc";
const loginController = LoginController;
export const authRouter = router({
    signup: publicProcedure
        .input(signupSchema)
        .mutation(async ({ input, ctx }) => {
        return SignupController(input, ctx);
    }),
    login: publicProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
        return loginController.handle(input, ctx);
    }),
});
