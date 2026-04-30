import { Skeleton } from "@/components/ui/skeleton";

export default function LinksLoading() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-6 py-8 md:px-12 md:py-10">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>

        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <Skeleton className="h-5 w-96" />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Skeleton className="h-8 w-full sm:w-80" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-border/60 p-2"
              >
                <Skeleton className="size-8 rounded-md" />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
