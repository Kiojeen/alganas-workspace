import { Skeleton } from "@/components/ui/skeleton";

export default function FolderPromptsLoading() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-6 py-8 md:px-12 md:py-10">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>

        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <Skeleton className="h-8 w-36" />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Skeleton className="h-8 w-full sm:w-80" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-border/60"
              >
                <Skeleton className="aspect-video w-full rounded-none" />
                <div className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <Skeleton className="h-6 w-36" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-11/12" />
                      <Skeleton className="h-4 w-9/12" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
