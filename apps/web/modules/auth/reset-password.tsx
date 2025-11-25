"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  token: string;
};
export function ResetPassword({ token }: Props) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const router = useRouter();

  const { mutate, isPending, reset } = trpc.auth.resetPassword.useMutation({
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        reset();
        return;
      }
      toast.success(result.message);
      router.push(result.redirectTo as string);
      reset();
    },

    onError: (error) => {
      if (error.data?.code === "BAD_REQUEST") {
        try {
          const validationErrors = JSON.parse(error.message);
          const firstError = validationErrors[0];
          const errorMessage = firstError.message || "Invalid input.";
          toast.error(errorMessage);
        } catch {
          toast.error("Something went wrong.");
        }
      } else {
        toast.error("Something went wrong.");
      }
    },
  });

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain a lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain an uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain a number";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setErrors({ newPassword: passwordError });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    mutate({ token, newPassword });
  };

  const passwordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "" };
    if (password.length < 8) return { strength: 1, label: "Weak" };
    if (validatePassword(password)) return { strength: 2, label: "Fair" };
    if (password.length < 12) return { strength: 3, label: "Good" };
    return { strength: 4, label: "Strong" };
  };

  const strength = passwordStrength(newPassword);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        <Card className="border-0 shadow-2xl bg-white rounded-3xl overflow-hidden">
          <CardHeader className="text-center px-6 sm:px-10 pt-10 sm:pt-14 pb-6 space-y-4">
            <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black flex items-center justify-center mb-2">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <CardTitle className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Reset password
            </CardTitle>
            <CardDescription className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
              Choose a strong password to secure your account
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 sm:px-10 pb-10 sm:pb-14">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="new-password"
                  className="text-sm font-semibold text-gray-900"
                >
                  New password
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className={`h-12 sm:h-14 rounded-xl border-2 ${
                      errors.newPassword ? "border-red-500" : "border-gray-200"
                    } focus:border-black focus:ring-0 text-base px-4 pr-12 transition-colors`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.newPassword}
                  </p>
                )}
                {newPassword && !errors.newPassword && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            level <= strength.strength
                              ? strength.strength === 1
                                ? "bg-red-500"
                                : strength.strength === 2
                                ? "bg-orange-500"
                                : strength.strength === 3
                                ? "bg-yellow-500"
                                : "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    {strength.label && (
                      <p
                        className={`text-xs font-medium ${
                          strength.strength === 1
                            ? "text-red-600"
                            : strength.strength === 2
                            ? "text-orange-600"
                            : strength.strength === 3
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        Password strength: {strength.label}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="confirm-password"
                  className="text-sm font-semibold text-gray-900"
                >
                  Confirm password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`h-12 sm:h-14 rounded-xl border-2 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-200"
                    } focus:border-black focus:ring-0 text-base px-4 pr-12 transition-colors`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <p className="text-xs font-semibold text-gray-900 mb-2">
                  Password requirements:
                </p>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li className="flex items-center gap-2">
                    <span
                      className={
                        newPassword.length >= 8 ? "text-green-600" : ""
                      }
                    >
                      {newPassword.length >= 8 ? "✓" : "•"}
                    </span>
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className={
                        /(?=.*[a-z])/.test(newPassword) ? "text-green-600" : ""
                      }
                    >
                      {/(?=.*[a-z])/.test(newPassword) ? "✓" : "•"}
                    </span>
                    One lowercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className={
                        /(?=.*[A-Z])/.test(newPassword) ? "text-green-600" : ""
                      }
                    >
                      {/(?=.*[A-Z])/.test(newPassword) ? "✓" : "•"}
                    </span>
                    One uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className={
                        /(?=.*\d)/.test(newPassword) ? "text-green-600" : ""
                      }
                    >
                      {/(?=.*\d)/.test(newPassword) ? "✓" : "•"}
                    </span>
                    One number
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold rounded-xl h-12 sm:h-14 text-base transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="w-5 h-5" />
                    <span>Resetting password...</span>
                  </span>
                ) : (
                  "Reset password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
