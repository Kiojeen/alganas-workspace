import type { ReactNode } from "react";

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
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
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
