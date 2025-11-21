"use client";

import { SignoutButton } from "@/components/sign-out-button";

export function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1>Hello, logged in user.</h1>
      <SignoutButton />
    </div>
  );
}
