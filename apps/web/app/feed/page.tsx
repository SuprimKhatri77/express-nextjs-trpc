export const dynamic = "force-dynamic";

import { Dashboard } from "@/modules/feed/feed";
import { getServerTrpc } from "@/trpc/trpc-server";
import { redirect } from "next/navigation";

export default async function Page() {
  const trpc = await getServerTrpc();
  const session = await trpc.auth.getUserSession.query();
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
