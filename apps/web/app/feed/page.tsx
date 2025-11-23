import { Dashboard } from "@/modules/feed/feed";
import { trpcServer } from "@/trpc/trpc-server";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await trpcServer.auth.getUserSession.query();
  console.log("session: ", session);
  if (!session) redirect("/login");
  if (!session.user.emailVerified)
    redirect(
      `/verify-email?from=${encodeURIComponent(
        "feed"
      )}&context=${encodeURIComponent("verify email")}`
    );
  return <Dashboard user={session.user} />;
}
