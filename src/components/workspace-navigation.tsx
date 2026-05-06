"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  FolderHeart,
  Link2,
  LogInIcon,
  UserRoundPlusIcon,
  Menu,
  Home,
} from "lucide-react";
import { useState, useEffect } from "react";

import { authClient, type User } from "@/server/better-auth/client";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "./theme-toggle";
import { toast } from "sonner";

const navigationItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/prompts", label: "Prompts", icon: FolderHeart },
  { href: "/links", label: "Links", icon: Link2 },
];

function getUserInitials(user?: User) {
  const source = user?.name?.trim() ?? user?.email?.trim() ?? "G";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function WorkspaceNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const session = authClient.useSession();
  const user = session.data?.user;
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const displayName = user?.name?.trim() ?? "Workspace User";
  const displayEmail = user?.email?.trim() ?? "Not signed in";
  const userInitials = getUserInitials(user);

  const handleSignOut = () =>
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out successfully");
          router.refresh();
        },
      },
    });

  return (
    <header className="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
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

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
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

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Desktop user dropdown */}
          <div className="hidden md:block">
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
                    onClick={handleSignOut}
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login" prefetch>
                        <LogInIcon className="mr-2 h-4 w-4" />
                        Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/signup" prefetch>
                        <UserRoundPlusIcon className="mr-2 h-4 w-4" />
                        Signup
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex w-72 flex-col p-0">
                <SheetHeader className="border-b-border border-b px-3 py-3">
                  <SheetTitle asChild>
                    <Link
                      href="/"
                      prefetch
                      className="flex items-center gap-2"
                      onClick={() => setMobileOpen(false)}
                    >
                      <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg shadow-sm">
                        <span className="leading-none font-bold">A</span>
                      </div>
                      <span className="font-semibold tracking-tight">
                        Alganas Workspace
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
                  {navigationItems.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href));
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-secondary text-secondary-foreground"
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                        )}
                      >
                        {Icon && <Icon className="h-4 w-4 shrink-0" />}
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="border-t-border space-y-3 border-t px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 shrink-0 border shadow-sm">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm leading-none font-medium">
                        {displayName}
                      </span>
                      <span className="text-muted-foreground mt-1 truncate text-xs">
                        {displayEmail}
                      </span>
                    </div>
                  </div>

                  {!!user ? (
                    <Button
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive w-full justify-start px-3"
                      onClick={() => {
                        setMobileOpen(false);
                        handleSignOut();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-3"
                        asChild
                      >
                        <Link
                          href="/login"
                          prefetch
                          onClick={() => setMobileOpen(false)}
                        >
                          <LogInIcon className="mr-2 h-4 w-4" />
                          Login
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-3"
                        asChild
                      >
                        <Link
                          href="/signup"
                          prefetch
                          onClick={() => setMobileOpen(false)}
                        >
                          <UserRoundPlusIcon className="mr-2 h-4 w-4" />
                          Signup
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
