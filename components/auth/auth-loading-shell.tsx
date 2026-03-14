import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthLoadingShell() {
  return (
    <main className="dashboard-theme min-h-screen bg-background px-6 py-10 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_28rem]">
        <section className="rounded-[2rem] border border-border/70 bg-card/80 p-8 shadow-[0_25px_80px_-48px_rgba(7,29,55,0.75)] backdrop-blur">
          <div className="flex gap-3">
            <Skeleton className="h-7 w-28 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
          <div className="mt-10 max-w-3xl space-y-6">
            <Skeleton className="size-14 rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-28 rounded-full" />
              <Skeleton className="h-12 w-full max-w-2xl" />
              <Skeleton className="h-12 w-4/5 max-w-xl" />
              <Skeleton className="h-5 w-full max-w-2xl" />
              <Skeleton className="h-5 w-3/4 max-w-xl" />
            </div>
          </div>
        </section>

        <Card className="border-border/70 bg-card/90">
          <CardHeader className="gap-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-40" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
            </div>
            <Skeleton className="h-11 w-full rounded-full" />
            <Skeleton className="h-4 w-40" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
