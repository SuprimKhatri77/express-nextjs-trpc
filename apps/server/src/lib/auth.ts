import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema";
import { sendMail } from "./send-mail";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    resetPasswordTokenExpiresIn: 3600,
    sendResetPassword: async ({ user, url, token }, request) => {
      const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      await sendMail({
        to: user.email,
        subject: "Reset Account Password",
        text: `
Reset Your Connect Password

We received a request to reset the password for your Connect account.

To reset your password, please click the link below:

${resetPasswordUrl}

This link will expire in 1 hour for security purposes.

If you did not request a password reset, please ignore this email and your password will remain unchanged. Your account is secure.

For security reasons, we recommend:
- Using a strong, unique password
- Enabling two-factor authentication (if available)
- Never sharing your password with anyone

Need help? Contact our support team.

The Connect Team
  `,

        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Connect Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #000000;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 48px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: -0.5px;">
                Connect
              </h1>
              <div style="width: 60px; height: 3px; background-color: #ffffff; margin: 16px auto 0;"></div>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 48px 40px;">
              <h2 style="margin: 0 0 16px; color: #000000; font-size: 28px; font-weight: 600; line-height: 1.3;">
                Reset Your Password
              </h2>
              <p style="margin: 0 0 24px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                We received a request to reset the password for your <strong>Connect</strong> account. Click the button below to create a new password.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetPasswordUrl}" 
                       style="display: inline-block; padding: 16px 48px; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; transition: all 0.3s ease;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 32px 0 0; color: #6b6b6b; font-size: 14px; line-height: 1.6;">
                This password reset link will expire in <strong>1 hour</strong> for security purposes.
              </p>
              
              <!-- Divider -->
              <div style="border-top: 1px solid #e5e5e5; margin: 32px 0;"></div>
              
              <!-- Alternative Link -->
              <p style="margin: 0 0 12px; color: #6b6b6b; font-size: 14px; line-height: 1.6;">
                Button not working? Copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 32px; word-break: break-all;">
                <a href="${resetPasswordUrl}" 
                   style="color: #000000; text-decoration: underline; font-size: 13px;">
                  ${resetPasswordUrl}
                </a>
              </p>
              
              <!-- Security Notice -->
              <div style="background-color: #f8f8f8; border-left: 4px solid #000000; padding: 16px 20px; border-radius: 4px;">
                <p style="margin: 0 0 8px; color: #000000; font-size: 14px; font-weight: 600;">
                  🔒 Security Notice
                </p>
                <p style="margin: 0; color: #4a4a4a; font-size: 13px; line-height: 1.6;">
                  If you didn't request this password reset, please ignore this email. Your password will remain unchanged and your account is secure.
                </p>
              </div>
              
              <!-- Security Tips -->
              <div style="margin-top: 24px;">
                <p style="margin: 0 0 12px; color: #000000; font-size: 14px; font-weight: 600;">
                  Password Security Tips:
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #6b6b6b; font-size: 13px; line-height: 1.8;">
                  <li>Use a strong, unique password</li>
                  <li>Never share your password with anyone</li>
                  <li>Enable two-factor authentication when available</li>
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f8f8; padding: 32px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 8px; color: #9b9b9b; font-size: 13px; line-height: 1.5;">
                Need help? Contact us at support@connect.com
              </p>
              <p style="margin: 0; color: #9b9b9b; font-size: 13px; line-height: 1.5;">
                © 2024 Connect. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,
      });
    },
  },
  emailVerification: {
    expiresIn: 3600,
    autoSignInAfterVerification: true,
    sendOnSignIn: false,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const customVerificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
      await sendMail({
        to: user.email,
        subject: "Verify your Email",
        text: `
Welcome to Connect!

Thank you for joining our community. To complete your registration and start connecting with others, please verify your email address by clicking the link below:

${customVerificationUrl}

This link will expire in 24 hours for security purposes.

If you did not create an account with Connect, you can safely ignore this email.

Welcome aboard!
The Connect Team
  `,

        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Connect Account</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #000000;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 48px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: -0.5px;">
                Connect
              </h1>
              <div style="width: 60px; height: 3px; background-color: #ffffff; margin: 16px auto 0;"></div>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 48px 40px;">
              <h2 style="margin: 0 0 16px; color: #000000; font-size: 28px; font-weight: 600; line-height: 1.3;">
                Welcome aboard! 🎉
              </h2>
              <p style="margin: 0 0 24px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Thank you for joining <strong>Connect</strong>. We're excited to have you in our community. To get started and unlock all features, please verify your email address.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="${customVerificationUrl}" 
                       style="display: inline-block; padding: 16px 48px; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; transition: all 0.3s ease;">
                      Verify My Account
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 32px 0 0; color: #6b6b6b; font-size: 14px; line-height: 1.6;">
                This verification link will expire in <strong>24 hours</strong> for security purposes.
              </p>
              
              <!-- Divider -->
              <div style="border-top: 1px solid #e5e5e5; margin: 32px 0;"></div>
              
              <!-- Alternative Link -->
              <p style="margin: 0 0 12px; color: #6b6b6b; font-size: 14px; line-height: 1.6;">
                Button not working? Copy and paste this link into your browser:
              </p>
              <p style="margin: 0; word-break: break-all;">
                <a href="${customVerificationUrl}" 
                   style="color: #000000; text-decoration: underline; font-size: 13px;">
                  ${customVerificationUrl}
                </a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f8f8; padding: 32px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 8px; color: #9b9b9b; font-size: 13px; line-height: 1.5;">
                Didn't create an account? You can safely ignore this email.
              </p>
              <p style="margin: 0; color: #9b9b9b; font-size: 13px; line-height: 1.5;">
                © 2024 Connect. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,
      });
    },
  },
});
