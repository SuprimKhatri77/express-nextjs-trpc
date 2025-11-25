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
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function ForgotPassword() {
  const [email, setEmail] = useState("");

  const { mutate, isPending, reset } =
    trpc.auth.sendResetPasswordLink.useMutation({
      onSuccess: (result) => {
        if (!result.success) {
          toast.error(result.message);
          reset();
          return;
        }
        toast.success(result.message);
        setEmail("");
        reset();
      },
      onError: (error) => {
        if (error.data?.code === "BAD_REQUEST") {
          try {
            const validationErrors = JSON.parse(error.message);
            const firstError = validationErrors[0];
            const errorMessage = firstError?.message || "Invalid input";
            toast.error(errorMessage);
          } catch {
            toast.error(error.message);
          }
        } else {
          toast.error(error.message);
        }
      },
    });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ email });
  };

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
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <CardTitle className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Forgot password?
            </CardTitle>
            <CardDescription className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
              No worries! Enter your email and we&apos;ll send you reset
              instructions
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 sm:px-10 pb-10 sm:pb-14">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-900"
                >
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 sm:h-14 rounded-xl border-2 border-gray-200 focus:border-black focus:ring-0 text-base px-4 transition-colors"
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold rounded-xl h-12 sm:h-14 text-base transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="w-5 h-5" />
                    <span>Sending...</span>
                  </span>
                ) : (
                  "Send reset link"
                )}
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-sm flex items-center gap-2 w-full text-gray-600 hover:text-black font-medium transition-colors hover:bg-accent  dark:hover:bg-accent/50 h-9 px-4 py-2 justify-center rounded-md"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6 px-4">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-black hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
