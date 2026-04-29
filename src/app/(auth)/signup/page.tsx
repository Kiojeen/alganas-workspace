import { SignUpForm } from "@/features/auth/signup/components/signup-form";
import { requireUnauth } from "@/server/better-auth/utils";

export default async function LoginPage() {
  await requireUnauth();
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
