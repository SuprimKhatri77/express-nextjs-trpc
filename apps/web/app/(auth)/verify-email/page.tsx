import VerifyEmail from "@/modules/auth/verify-email";
import { trpcServer } from "@/trpc/trpc-server";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    token: string;
    from: "feed" | "signup";
    context: "verify email";
  }>;
};
export default async function Page({ searchParams }: Props) {
  const { token, from, context } = await searchParams;
  if (!token && !from && !context) redirect("/");
  const session = await trpcServer.auth.getUserSession.query();
  if (!session) redirect("/login");
  return (
    <VerifyEmail
      email={session.user.email}
      token={token}
      from={from}
      context={context}
    />
  );
}
