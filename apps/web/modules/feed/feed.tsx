"use client";

import { SignoutButton } from "@/components/sign-out-button";

type Props = {
  user: {
    name: string;
    email: string;
    id: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    image?: string | null | undefined;
  };
};
export function Dashboard({ user }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1>Hello, {user.name}.</h1>
      <SignoutButton />
    </div>
  );
}
