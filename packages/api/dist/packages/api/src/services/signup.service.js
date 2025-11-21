import { z } from "zod";
export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string(),
});
export class SignupService {
    async execute(input) {
        // Your business logic here
        // Database calls, validation, etc.
        // Example:
        const user = await this.createUser(input);
        const token = await this.generateToken(user);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            token,
        };
    }
    async createUser(input) {
        // Your DB logic
        return {
            id: "1",
            email: input.email,
            name: input.name,
        };
    }
    async generateToken(user) {
        // Your token generation logic
        return "jwt-token-here";
    }
}
