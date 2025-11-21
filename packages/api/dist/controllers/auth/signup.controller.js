import { signupSchema, signupUser } from "../../services/auth/signup.service";
export async function SignupController(input, ctx) {
    // Controller logic (logging, etc.)
    console.log("Signup attempt:", input.email);
    try {
        const result = await signupUser(input);
        return result;
    }
    catch (error) {
        // Error handling
        throw error;
    }
}
export { signupSchema };
