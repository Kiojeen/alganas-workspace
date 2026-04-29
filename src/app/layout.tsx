import "@/styles/globals.css";

import { type Metadata } from "next";

import { TooltipProvider } from "@/components/ui/tooltip";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { getSession } from "@/server/better-auth/server";
import { WorkspaceNavigation } from "@/components/workspace-navigation";
import { playfairDisplay } from "@/styles/fonts";

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
    <html lang="en" className={`${playfairDisplay.variable}`} suppressHydrationWarning>
      <body>
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
        </TRPCReactProvider>
      </body>
    </html>
  );
}
