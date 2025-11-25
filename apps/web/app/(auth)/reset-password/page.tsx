import { ResetPassword } from "@/modules/auth/reset-password";
import { getServerTrpc } from "@/trpc/trpc-server";

type Props = {
  searchParams: Promise<{ token: string }>;
};
export default async function Page({ searchParams }: Props) {
  const { token } = await searchParams;
  if (!token) {
    return (
      <div>
        <h1>Missing required credentials.</h1>
      </div>
    );
  }
  const trpc = await getServerTrpc();
  const result = await trpc.auth.verifyResetPasswordToken.query({
    token,
  });
  console.log(result);
  if (!result.success) {
    return (
      <div>
        <h1>{result.message}</h1>
      </div>
    );
  }
  return <ResetPassword token={token} />;
}
