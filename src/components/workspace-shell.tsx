import type { ReactNode } from "react";
import { WorkspaceNavigation } from "@/components/workspace-navigation";
import { getSession } from "@/server/better-auth/server";
import Link from "next/link";

interface WorkspaceShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export async function WorkspaceShell({
  title,
  description,
  children,
}: WorkspaceShellProps) {
  const session = await getSession();

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-6 md:gap-8 md:px-12">
          <Link
            href="/"
            className="mr-2 flex shrink-0 items-center gap-2 md:mr-4"
          >
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg shadow-sm">
              <span className="leading-none font-bold">A</span>
            </div>

            <span className="hidden font-semibold tracking-tight sm:inline-block">
              Alganas Workspace
            </span>
          </Link>

          {/* Navigation Component */}
          <WorkspaceNavigation user={session?.user} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-6 py-8 md:px-12 md:py-10">
        {/* Page Header */}
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground max-w-2xl text-base">
              {description}
            </p>
          )}
        </div>

        {/* Page Content with a subtle enter animation */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
