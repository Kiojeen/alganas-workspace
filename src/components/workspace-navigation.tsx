"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  FolderHeart,
  Link2,
  LogInIcon,
  UserRoundPlusIcon,
} from "lucide-react";
import { useState } from "react";

import { authClient } from "@/server/better-auth/client";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";
import { toast } from "sonner";

const navigationItems = [
  { href: "/", label: "Home", icon: null },
  { href: "/prompts", label: "Prompts", icon: FolderHeart },
  { href: "/links", label: "Links", icon: Link2 },
];

interface WorkspaceNavigationProps {
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
}

function getUserInitials(user?: WorkspaceNavigationProps["user"]) {
  const source = user?.name?.trim() ?? user?.email?.trim() ?? "G";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function WorkspaceNavigation({ user }: WorkspaceNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const displayName = user?.name?.trim() ?? "Workspace User";
  const displayEmail = user?.email?.trim() ?? "Not signed in";
  const userInitials = getUserInitials(user);

  return (
    <header className="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          prefetch
          className="mr-2 flex shrink-0 items-center gap-2 md:mr-4"
        >
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg shadow-sm">
            <span className="leading-none font-bold">A</span>
          </div>

          <span className="hidden font-semibold tracking-tight sm:inline-block">
            Alganas Workspace
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex gap-2">
                <Avatar className="h-9 w-9 border shadow-sm transition-opacity hover:opacity-80">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden flex-col items-start text-left sm:flex">
                  <span className="text-sm leading-none font-medium">
                    {displayName}
                  </span>
                  <span className="text-muted-foreground mt-1 max-w-30 truncate text-xs">
                    {displayEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none font-medium">
                    {displayName}
                  </p>
                  <p className="text-muted-foreground text-xs leading-none">
                    {displayEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {!!user ? (
                <DropdownMenuItem
                  onClick={() =>
                    authClient.signOut({
                      fetchOptions: {
                        onSuccess: () => {
                          toast.success("Signed out successfully");
                          router.refresh();
                        },
                      },
                    })
                  }
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login" prefetch>
                      <LogInIcon />
                      Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup" prefetch>
                      <UserRoundPlusIcon />
                      Signup
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
