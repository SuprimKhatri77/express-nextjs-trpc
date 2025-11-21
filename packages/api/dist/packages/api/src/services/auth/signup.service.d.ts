import { z } from "zod";
import { signupSchema } from "../../schema/auth.schema";
import { SignupResponse } from "../../types/auth.types";
export type SignupInput = z.infer<typeof signupSchema>;
export declare function signupUser(input: SignupInput): Promise<SignupResponse>;
//# sourceMappingURL=signup.service.d.ts.map