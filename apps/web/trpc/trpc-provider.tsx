"use client";

import { type QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { makeQueryClient } from "@/trpc/query-client";

let clientQuerySingleton: QueryClient;
function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  return (clientQuerySingleton ??= makeQueryClient());
}

function getUrl() {
  const base = (() => {
    if (typeof window === "undefined") return "";
    if (process.env.BACKEND_URL) return `${process.env.BACKEND_URL}`;
    return `http://localhost:5000`;
  })();
  return `${base}/trpc`;
}
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: getUrl(),
          fetch(url, options) {
            return fetch(url, { ...options, credentials: "include" });
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
