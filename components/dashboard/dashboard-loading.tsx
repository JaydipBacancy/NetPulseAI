import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function StatCards({ count }: { count: number }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <Card key={`stat-${index}`}>
          <CardHeader className="space-y-3 pb-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-24" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-6 w-24 rounded-full" />
            <div className="grid gap-2 sm:grid-cols-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

function TableSkeleton({
  columns,
  rows,
}: {
  columns: number;
  rows: number;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Skeleton className="h-10 w-full md:col-span-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton className="h-9 w-24 rounded-full" key={`chip-${index}`} />
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-border/70">
        <div className="grid gap-3 border-b border-border/70 bg-background/60 px-4 py-3 md:grid-cols-6">
          {Array.from({ length: columns }, (_, index) => (
            <Skeleton className="h-4 w-24" key={`head-${index}`} />
          ))}
        </div>
        <div className="space-y-3 px-4 py-4">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div className="grid gap-3 md:grid-cols-6" key={`row-${rowIndex}`}>
              {Array.from({ length: columns }, (_, columnIndex) => (
                <Skeleton className="h-4 w-full" key={`cell-${rowIndex}-${columnIndex}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-4 w-36" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  children,
  titleWidth = "w-40",
}: {
  children: ReactNode;
  titleWidth?: string;
}) {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <Skeleton className={`h-6 ${titleWidth}`} />
        <Skeleton className="h-4 w-72 max-w-full" />
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function DashboardShellLoading() {
  return (
    <main className="dashboard-theme min-h-screen bg-background px-3 py-3 sm:px-4 md:px-5 md:py-4">
      <div className="mx-auto grid w-full max-w-[1680px] gap-4 lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:gap-5">
        <aside className="hidden lg:block">
          <Card className="h-[calc(100vh-2rem)] overflow-hidden border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(244,248,252,0.98))] text-foreground">
            <CardContent className="flex h-full flex-col gap-5 p-4">
              <div className="border-b border-border/70 pb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-11 rounded-[1.25rem] bg-foreground/[0.08]" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20 bg-foreground/[0.08]" />
                    <Skeleton className="h-5 w-36 bg-foreground/[0.08]" />
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <Skeleton className="h-3 w-20 bg-foreground/[0.08]" />
                {Array.from({ length: 6 }, (_, index) => (
                  <Skeleton className="h-12 w-full bg-foreground/[0.08]" key={`nav-${index}`} />
                ))}
              </div>
              <div className="space-y-3 border-t border-border/70 pt-4">
                <Skeleton className="h-14 w-full bg-foreground/[0.08]" />
                <Skeleton className="h-10 w-full rounded-full bg-foreground/[0.08]" />
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="space-y-4">
          <Card className="overflow-hidden border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(244,248,252,0.98))] text-foreground lg:hidden">
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-2xl bg-foreground/[0.08]" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20 bg-foreground/[0.08]" />
                    <Skeleton className="h-5 w-32 bg-foreground/[0.08]" />
                  </div>
                </div>
                <Skeleton className="h-9 w-24 rounded-full bg-foreground/[0.08]" />
              </div>
              <Skeleton className="h-14 w-full bg-foreground/[0.08]" />
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {Array.from({ length: 6 }, (_, index) => (
                  <Skeleton className="h-10 w-full bg-foreground/[0.08]" key={`mobile-nav-${index}`} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-border/70 bg-gradient-to-r from-card via-card to-accent/35">
            <CardContent className="space-y-4 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <Skeleton className="size-11 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-8 w-56" />
                  <Skeleton className="h-4 w-80 max-w-full" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 }, (_, index) => (
                  <Skeleton className="h-7 w-28 rounded-full" key={`header-tag-${index}`} />
                ))}
              </div>
            </CardContent>
          </Card>

          <ManagementPageLoading />
        </div>
      </div>
    </main>
  );
}

export function DashboardOverviewLoading() {
  return (
    <div className="space-y-4">
      <StatCards count={4} />
      <StatCards count={4} />
      <section className="grid gap-4 lg:grid-cols-2">
        <SectionCard>
          <Skeleton className="h-3 w-full rounded-full" />
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </SectionCard>
        <SectionCard>
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton className="h-12 w-full" key={`compliance-${index}`} />
            ))}
          </div>
        </SectionCard>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <SectionCard key={`chart-${index}`} titleWidth="w-32">
            <div className="space-y-3">
              {Array.from({ length: 4 }, (_, pointIndex) => (
                <Skeleton className="h-10 w-full" key={`point-${index}-${pointIndex}`} />
              ))}
            </div>
          </SectionCard>
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <SectionCard>
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton className="h-20 w-full" key={`alert-${index}`} />
            ))}
          </div>
        </SectionCard>
        <SectionCard>
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton className="h-20 w-full" key={`test-${index}`} />
            ))}
          </div>
        </SectionCard>
      </section>
    </div>
  );
}

export function ManagementPageLoading() {
  return (
    <Card className="border-border/70 bg-card/90">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <TableSkeleton columns={6} rows={6} />
      </CardContent>
    </Card>
  );
}

export function TestsPageLoading() {
  return (
    <div className="space-y-4">
      <SectionCard titleWidth="w-44">
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="mt-4 h-11 w-40 rounded-full" />
      </SectionCard>
      <ManagementPageLoading />
      <ManagementPageLoading />
    </div>
  );
}

export function AnalysisPageLoading() {
  return (
    <div className="space-y-4">
      <SectionCard titleWidth="w-44">
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton className="h-24 w-full" key={`analysis-stat-${index}`} />
          ))}
        </div>
        <Skeleton className="mt-4 h-11 w-44 rounded-full" />
      </SectionCard>
      <Card>
        <CardHeader className="space-y-3">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </CardHeader>
        <CardContent>
          <TableSkeleton columns={4} rows={5} />
        </CardContent>
      </Card>
    </div>
  );
}

export function ReportsPageLoading() {
  return (
    <div className="space-y-4">
      <SectionCard titleWidth="w-40">
        <Skeleton className="h-4 w-44" />
      </SectionCard>
      <section className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <SectionCard key={`report-summary-${index}`} titleWidth="w-36">
            <Skeleton className="h-10 w-24" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </SectionCard>
        ))}
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <SectionCard key={`report-detail-${index}`} titleWidth="w-44">
            <div className="space-y-3">
              {Array.from({ length: 4 }, (_, rowIndex) => (
                <Skeleton className="h-4 w-full" key={`report-line-${index}-${rowIndex}`} />
              ))}
            </div>
          </SectionCard>
        ))}
      </section>
      <SectionCard titleWidth="w-56">
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton className="h-4 w-full" key={`recommendation-${index}`} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
