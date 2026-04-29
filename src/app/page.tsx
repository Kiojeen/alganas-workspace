import Link from "next/link";
import {
  FolderHeart,
  Link2,
  ArrowRight,
  Search,
  Users,
  Copy,
  Layers,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";

const features = [
  {
    icon: FolderHeart,
    title: "Prompt Library",
    description:
      "Organise your best AI prompts into labelled folders with custom icons. Tag by platform — ChatGPT, Claude, Gemini and more.",
    accent: false,
  },
  {
    icon: Link2,
    title: "Link Library",
    description:
      "Save reference URLs into folders. Copy, open, and search links in seconds — your bookmarks, but actually useful.",
    accent: true,
  },
  {
    icon: Layers,
    title: "Folder System",
    description:
      "Group both prompts and links by project or workflow. Custom icons make every folder instantly recognisable.",
    accent: false,
  },
  {
    icon: Search,
    title: "Instant Search",
    description:
      "Find any prompt or link in milliseconds. Full-text search across all folders — no more digging through notes.",
    accent: false,
  },
  {
    icon: Users,
    title: "Team Workspaces",
    description:
      "Share folders with teammates. Keep everyone aligned on the prompts and resources that actually work.",
    accent: false,
  },
  {
    icon: Copy,
    title: "One-click Copy",
    description:
      "Copy any prompt or link to clipboard instantly. Reduce friction between your library and the AI tools you use.",
    accent: false,
  },
];

const steps = [
  {
    n: "1",
    title: "Create a workspace",
    sub: "Sign up and set up your personal or team workspace in seconds.",
    primary: true,
  },
  {
    n: "2",
    title: "Build your folders",
    sub: "Create folders with custom icons for prompts and links.",
    primary: false,
  },
  {
    n: "3",
    title: "Save your best work",
    sub: "Add prompts with platform tags and save reference URLs.",
    primary: false,
  },
  {
    n: "4",
    title: "Use it anywhere",
    sub: "Copy, search, and share whenever you need it.",
    primary: false,
  },
];

export default async function HomePage() {
  const promptCounts = await api.prompts.getCounts();
  const linkCounts = await api.links.getCounts();
  const latestPrompt = await api.prompts.getLatest();
  return (
    <>
      <main className="bg-background text-foreground">
        <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-20 text-center">
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0",
              "dark:bg-[radial-gradient(ellipse_70%_55%_at_50%_35%,color-mix(in_oklch,var(--primary)_20%,transparent)_0%,transparent_70%)]",
            )}
          />

          <h1
            className="text-foreground font-playfair-display max-w-190 font-bold tracking-tight"
            style={{
              fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)",
              lineHeight: 1.1,
              animationName: "fadeUp",
              animationDuration: ".65s",
              animationFillMode: "both",
            }}
          >
            Your prompts &amp; links,{" "}
            <span className="font-playfair-display text-[#c44b2b] italic">
              beautifully
            </span>{" "}
            organised
          </h1>

          <p
            className="text-muted-foreground mt-5 leading-relaxed font-light"
            style={{
              maxWidth: 500,
              fontSize: "1.0625rem",
              animationName: "fadeUp",
              animationDuration: ".65s",
              animationDelay: ".1s",
              animationFillMode: "both",
            }}
          >
            Alganas is the workspace for AI power users — save your best
            prompts, organise reference links, and never lose a great idea
            again.
          </p>

          <div
            className="mt-8 flex items-center gap-3"
            style={{
              animationName: "fadeUp",
              animationDuration: ".65s",
              animationDelay: ".2s",
              animationFillMode: "both",
            }}
          >
            <Link
              href="/prompts"
              className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all hover:-translate-y-px hover:opacity-90"
            >
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#features"
              className="border-border text-foreground hover:bg-secondary inline-flex items-center rounded-full border px-6 py-2.5 text-sm font-medium transition-colors"
            >
              See features
            </Link>
          </div>

          {/* App preview */}
          <div
            className="border-border mt-16 w-full overflow-hidden rounded-2xl border shadow-2xl"
            style={{
              maxWidth: 860,
              animationName: "fadeUp",
              animationDuration: ".7s",
              animationDelay: ".3s",
              animationFillMode: "both",
            }}
          >
            {/* fake browser bar */}
            <div className="bg-primary flex items-center gap-2 px-4 py-3">
              <span className="bg-destructive/70 h-3 w-3 rounded-full" />
              <span className="h-3 w-3 rounded-full bg-[oklch(0.78_0.14_80)]" />
              <span className="h-3 w-3 rounded-full bg-[oklch(0.65_0.15_145)]" />
            </div>
            <div className="bg-card grid grid-cols-3 gap-4 px-6 py-6">
              {[
                {
                  icon: "📝",
                  title: "Prompt Library",
                  sub: `${promptCounts?.folders ?? 0} folders · ${promptCounts?.prompts ?? 0} prompts`,
                  fill: 70,
                },
                {
                  icon: "🔗",
                  title: "Link Library",
                  sub: `${linkCounts?.folders ?? 0} folders · ${linkCounts?.links ?? 0} links`,
                  fill: 48,
                },
                {
                  icon: "✨",
                  title: "Latest prompt saved",
                  sub: latestPrompt
                    ? `${latestPrompt.model} · ${new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(latestPrompt.createdAt))}`
                    : "Add your first prompt",
                  fill: latestPrompt ? 90 : 0,
                  accent: true,
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="bg-background border-border flex flex-col gap-2 rounded-xl border p-4"
                  style={
                    c.accent
                      ? {
                          borderColor:
                            "color-mix(in oklch, var(--primary) 30%, transparent)",
                        }
                      : {}
                  }
                >
                  <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg text-base">
                    {c.icon}
                  </div>
                  <p className="text-foreground text-sm leading-tight font-medium">
                    {c.title}
                  </p>
                  <p className="text-muted-foreground text-xs">{c.sub}</p>
                  <div className="bg-muted mt-1 h-1.5 overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${c.fill}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="bg-muted/30 px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
                  Features
                </p>
                <h2
                  className="text-foreground font-bold"
                  style={{
                    fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                    lineHeight: 1.2,
                    maxWidth: 460,
                  }}
                >
                  Everything you need to stay{" "}
                  <span className="text-[#c44b2b] italic">
                    organised &amp; sharp
                  </span>
                </h2>
              </div>
              <p className="text-muted-foreground max-w-sm text-sm leading-relaxed font-light">
                Built for teams and solo creators who work with AI daily. Stop
                losing context. Start building a personal knowledge base.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className={cn(
                      "rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg",
                      f.accent
                        ? "bg-primary text-primary-foreground border-transparent"
                        : "bg-card border-border",
                    )}
                  >
                    <div
                      className={cn(
                        "mb-4 flex h-10 w-10 items-center justify-center rounded-xl",
                        f.accent ? "bg-primary-foreground/10" : "bg-muted",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5",
                          f.accent
                            ? "text-primary-foreground"
                            : "text-foreground",
                        )}
                      />
                    </div>
                    <p
                      className={cn(
                        "mb-1.5 font-medium",
                        f.accent
                          ? "text-primary-foreground"
                          : "text-foreground",
                      )}
                    >
                      {f.title}
                    </p>
                    <p
                      className={cn(
                        "text-sm leading-relaxed font-light",
                        f.accent
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground",
                      )}
                    >
                      {f.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how" className="bg-background px-6 py-20">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
              How it works
            </p>
            <h2
              className="text-foreground mx-auto font-bold"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                lineHeight: 1.2,
                maxWidth: 480,
              }}
            >
              From zero to organised{" "}
              <span className="text=[#c44b2b] italic">in four steps</span>
            </h2>

            <div className="relative mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
              {/* connector line */}
              <div
                aria-hidden
                className="absolute top-6 right-[12.5%] left-[12.5%] hidden h-px md:block"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, var(--border), transparent)",
                }}
              />
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="flex flex-col items-center gap-3 text-center"
                >
                  <div
                    className={cn(
                      "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border text-lg font-bold",
                      s.primary
                        ? "bg-primary text-primary-foreground border-transparent"
                        : "bg-card text-foreground border-border",
                    )}
                  >
                    {s.n}
                  </div>
                  <p className="text-foreground text-sm font-medium">
                    {s.title}
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed font-light">
                    {s.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary px-6 py-24 text-center">
          <p className="text-primary-foreground/50 mb-4 text-xs font-semibold tracking-widest uppercase">
            Get started today
          </p>
          <h2
            className="text-primary-foreground mx-auto font-bold"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              lineHeight: 1.15,
              maxWidth: 600,
            }}
          >
            Stop losing your best{" "}
            <span className="italic">prompts and links</span>
          </h2>
          <p
            className="text-primary-foreground/60 mx-auto mt-4 mb-8 text-sm leading-relaxed font-light"
            style={{ maxWidth: 420 }}
          >
            Join AI users who keep their knowledge organised with Alganas. Free
            to start, no credit card required.
          </p>
          <Link
            href="/prompts"
            className="bg-primary-foreground text-primary inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-all hover:-translate-y-px hover:opacity-90"
          >
            Create free account <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <footer className="bg-primary border-primary-foreground/10 border-t px-6 py-6 text-center">
          <p className="text-primary-foreground/30 text-xs">
            © 2026 Alganas. All rights reserved.
          </p>
        </footer>
      </main>

      {/* keyframe for hero animations */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
