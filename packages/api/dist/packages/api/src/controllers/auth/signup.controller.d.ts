import { signupSchema } from "./../../schema/auth.schema";
import z from "zod";
import { Context } from "../../../../../apps/server/src/context";
import { SignupResponse } from "../../types/auth.types";
export declare function SignupController(input: z.infer<typeof signupSchema>, ctx: Context): Promise<SignupResponse>;
//# sourceMappingURL=signup.controller.d.ts.map