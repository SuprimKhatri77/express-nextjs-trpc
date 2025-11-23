"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function VerifyEmail({
  email,
  token,
  from,
  context,
}: {
  email: string;
  token: string;
  from: "feed" | "signup";
  context: "verify email";
}) {
  const router = useRouter();

  const { mutate, isPending, reset } = trpc.auth.verifyUserEmail.useMutation({
    onSuccess: (result) => {
      if (!result.success && result.message) {
        toast.error(result.message);
        reset();
        return;
      }
      toast.success(result.message);
      router.push("/feed");
      reset();
    },
    onError: () => {
      toast.error("Something went wrong.");
      reset();
    },
  });

  useEffect(() => {
    if (!token && from) return;
    mutate({ token });
  }, [token, mutate, from]);

  const { mutate: resendVerificationEmail, isPending: isLoading } =
    trpc.auth.resendVerificationEmail.useMutation({
      onSuccess: (result) => {
        if (!result.success && result.message) {
          toast.error(result.message);
          reset();
          return;
        }
        toast.success(result.message);
        reset();
      },
      onError: () => {
        toast.error("Something went wrong.");
        reset();
      },
    });
  useEffect(() => {
    if (
      decodeURIComponent(from) === "feed" &&
      decodeURIComponent(context) === "verify email"
    ) {
      resendVerificationEmail({ email });
    }
  }, [resendVerificationEmail, email, from, context]);

  const { mutate: signoutUser, isPending: isLogginOut } =
    trpc.auth.signout.useMutation({
      onSuccess: (result) => {
        if (!result.success && result.message) {
          toast.error(result.message);
          reset();
          return;
        }

        toast.success(result.message);
        router.push("/login");
        reset();
      },
      onError: () => {
        toast.error("Something went wrong.");
        reset();
      },
    });

  if (from === "signup") {
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <CardTitle className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Check your email
              </CardTitle>
              <CardDescription className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
                We&apos;ve sent a verification link to
              </CardDescription>
              <div className="pt-2">
                <p className="text-sm sm:text-base font-semibold text-black bg-gray-100 px-4 py-3 rounded-xl break-all">
                  {email}
                </p>
              </div>
            </CardHeader>

            <CardContent className="px-6 sm:px-10 pb-10 sm:pb-14 space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <p className="text-sm text-gray-700 mb-4 text-center font-medium">
                  Didn&apos;t receive the email?
                </p>
                <Button
                  onClick={() => resendVerificationEmail({ email })}
                  disabled={isPending || isLoading || isLogginOut}
                  className="w-full bg-black hover:bg-gray-800 text-white font-semibold rounded-xl h-12 sm:h-14 text-base transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="w-5 h-5" />
                      <span>Sending...</span>
                    </span>
                  ) : (
                    "Resend verification email"
                  )}
                </Button>
              </div>

              <div className="text-center pt-2">
                <p className="text-sm text-gray-600 mb-3">
                  Wrong email address?
                </p>
                <Button
                  onClick={() => signoutUser()}
                  disabled={isPending || isLoading || isLogginOut}
                  variant="outline"
                  className="w-full border-2 border-gray-300 hover:border-black hover:bg-gray-50 text-gray-900 font-semibold rounded-xl h-12 sm:h-14 text-base transition-all duration-200"
                >
                  {isLogginOut ? <Spinner /> : "Logout and try again"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-gray-500 mt-6 px-4">
            Make sure to check your spam folder if you don&apos;t see the email
          </p>
        </div>
      </div>
    );
  }

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
              Verification required
            </CardTitle>
            <CardDescription className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
              Please verify your email to continue
            </CardDescription>
            <div className="pt-2">
              <p className="text-sm sm:text-base font-semibold text-black bg-gray-100 px-4 py-3 rounded-xl break-all">
                {email}
              </p>
            </div>
          </CardHeader>

          <CardContent className="px-6 sm:px-10 pb-10 sm:pb-14 space-y-6">
            {isPending ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-5">
                <Spinner className="w-12 h-12" />
                <div className="text-center space-y-2">
                  <p className="text-lg font-semibold text-gray-900">
                    Verifying your email
                  </p>
                  <p className="text-sm text-gray-600">
                    Please wait a moment...
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <p className="text-sm text-gray-700 mb-4 text-center font-medium">
                    Didn&apos;t receive the email?
                  </p>
                  <Button
                    onClick={() => resendVerificationEmail({ email })}
                    disabled={isPending || isLoading || isLogginOut}
                    className="w-full bg-black hover:bg-gray-800 text-white font-semibold rounded-xl h-12 sm:h-14 text-base transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Spinner className="w-5 h-5" />
                        <span>Sending...</span>
                      </span>
                    ) : (
                      "Resend verification email"
                    )}
                  </Button>
                </div>

                <div className="text-center pt-2">
                  <p className="text-sm text-gray-600 mb-3">
                    Wrong email address?
                  </p>
                  <Button
                    onClick={() => signoutUser()}
                    disabled={isPending || isLoading || isLogginOut}
                    variant="outline"
                    className="w-full border-2 border-gray-300 hover:border-black hover:bg-gray-50 text-gray-900 font-semibold rounded-xl h-12 sm:h-14 text-base transition-all duration-200"
                  >
                    {isLogginOut ? <Spinner /> : "Logout and try again"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6 px-4">
          Make sure to check your spam folder if you don&apos;t see the email
        </p>
      </div>
    </div>
  );
}
