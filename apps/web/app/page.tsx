"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col gap-5 items-center justify-center">
      <h1>tRPC Demo</h1>
      <div className="flex gap-5 items-center">
        <Link href="/signup">
          <Button variant="outline">Signup</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline">Login</Button>
        </Link>
      </div>
    </div>
  );
}
