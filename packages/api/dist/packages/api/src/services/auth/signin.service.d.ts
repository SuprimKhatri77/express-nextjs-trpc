import z from "zod";
import { signinSchema } from "../../schema/auth.schema";
import { SigninResponse } from "../../types/auth.types";
export type SigninInput = z.infer<typeof signinSchema>;
export declare function signInUser(input: SigninInput): Promise<SigninResponse>;
//# sourceMappingURL=signin.service.d.ts.map