// services/auth/signup.service.ts
// ==========================================
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const signupSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
    name: z.string(),
});
export async function signupUser(input) {
    // Business logic
    const hashedPassword = await bcrypt.hash(input.password, 10);
    // Mock DB - replace with your actual DB
    const user = {
        id: "123",
        email: input.email,
        name: input.name,
        password: hashedPassword,
    };
    const token = jwt.sign({ userId: user.id }, "your-secret");
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
        token,
    };
}
