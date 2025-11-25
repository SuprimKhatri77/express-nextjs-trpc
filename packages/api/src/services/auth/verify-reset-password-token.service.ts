import z from "zod";
import { verifyResetPasswordTokenSchema } from "../../schema/auth/auth.schema";
import { VerifyResetPasswordTokenResponse } from "../../types/auth.types";
import { db } from "../../../../../apps/server/src/db";

export async function verifyResetPasswordToken(
  input: z.infer<typeof verifyResetPasswordTokenSchema>
): Promise<VerifyResetPasswordTokenResponse> {
  try {
    const tokenRecord = await db.query.verification.findFirst({
      where: (fields, { eq }) =>
        eq(fields.identifier, `reset-password:${input.token}`),
    });
    if (!tokenRecord) {
      return { success: false, message: "Invalid token" };
    }
    if (new Date() > tokenRecord.expiresAt) {
      return { success: false, message: "Token expired." };
    }
    return { success: true, message: "Valid token" };
  } catch (error) {
    console.log("error: ", error);
    return { success: false, message: "Failed to validate token" };
  }
}
