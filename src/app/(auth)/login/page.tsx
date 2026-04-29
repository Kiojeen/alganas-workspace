import { LoginForm } from "@/features/auth/login/components/login-form"
import { requireUnauth } from "@/server/better-auth/utils"

export default async function LoginPage() {
  await requireUnauth();
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
