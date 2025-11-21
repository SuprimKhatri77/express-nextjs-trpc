"use client";

import { trpc } from "@/utils/trpc";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

export function SignoutButton() {
  const router = useRouter();
  const { mutate, isPending, reset } = trpc.auth.signout.useMutation({
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        reset();
        return;
      }
      toast.success(result.message);
      router.push("/");
      reset();
    },
    onError: () => {
      toast.error("Something went wrong.");
      reset();
    },
  });
  return (
    <Button variant="destructive" disabled={isPending} onClick={() => mutate()}>
      {isPending ? <Spinner /> : "Logout"}
    </Button>
  );
}
