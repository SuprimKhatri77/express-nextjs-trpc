import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { headers } from "next/headers";
import { AppRouter } from "../../../packages/api/src";

export async function getServerTrpc() {
  const trpc = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${process.env.BACKEND_URL}/trpc`,
        headers: async () => {
          const headersList = await headers();
          return Object.fromEntries(headersList.entries());
        },
      }),
    ],
  });

  return trpc;
}

export const trpcServer = await getServerTrpc();
