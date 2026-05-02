import "@/styles/globals.css";

import { type Metadata } from "next";
import PWAProvider from "@/providers/sw-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { WorkspaceNavigation } from "@/components/workspace-navigation";
import { getSession } from "@/server/better-auth/server";
import { playfairDisplay } from "@/styles/fonts";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "Alganas Workspace",
  description:
    "Prompt workspace UI for saving, searching, and organizing designer prompts.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable}`}
      suppressHydrationWarning
    >
      <body>
        <PWAProvider>
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>
                <WorkspaceNavigation user={session?.user} />
                {children}
              </TooltipProvider>
              <Toaster />
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </TRPCReactProvider>
        </PWAProvider>
      </body>
    </html>
  );
}
