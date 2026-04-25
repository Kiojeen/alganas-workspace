"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, FolderHeart, Link2 } from "lucide-react";
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

const navigationItems = [
  {
    href: "/prompts",
    label: "Prompts",
    icon: FolderHeart,
  },
  {
    href: "/links",
    label: "Links",
    icon: Link2,
  },
];

interface WorkspaceNavigationProps {
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
}

function getUserInitials(user?: WorkspaceNavigationProps["user"]) {
  const source = user?.name?.trim() ?? user?.email?.trim() ?? "Guest";

  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function WorkspaceNavigation({ user }: WorkspaceNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      router.refresh();
      router.push("/");
    } finally {
      setIsSigningOut(false);
    }
  };

  const displayName = user?.name?.trim() ?? "Workspace User";
  const displayEmail = user?.email?.trim() ?? "Not signed in";
  const userInitials = getUserInitials(user);

  return (
    <div className="flex flex-1 items-center justify-between">
      <nav className="flex items-center gap-1 md:gap-2">
        {navigationItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
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
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center justify-center gap-4">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus-visible:ring-ring flex items-center gap-2 rounded-full outline-none focus-visible:ring-2">
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
            </button>
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
            <DropdownMenuItem
              onClick={handleSignOut}
              disabled={isSigningOut || !user?.email}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isSigningOut ? "Signing out..." : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
