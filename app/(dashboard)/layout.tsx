import type { ReactNode } from "react";
import { LogOut, RadioTower } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { AppProviders } from "@/components/providers/app-providers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireAuthenticatedUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await requireAuthenticatedUser();
  const userEmail = user.email ?? "Authenticated user";

  return (
    <AppProviders>
      <main className="min-h-screen bg-background px-3 py-3 sm:px-4 md:px-5 md:py-4">
        <div className="mx-auto grid w-full max-w-[1680px] gap-4 lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:gap-5">
          <aside className="hidden lg:sticky lg:top-4 lg:block lg:h-[calc(100vh-2rem)]">
            <Card className="flex h-full flex-col overflow-hidden border-[#0d2330]/8 bg-[#081722] text-white shadow-[0_32px_90px_-56px_rgba(8,23,34,0.95)]">
              <CardContent className="flex h-full flex-col gap-5 p-4">
                <div className="border-b border-white/8 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-[1.25rem] border border-white/10 bg-white/[0.06] text-white">
                      <RadioTower className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        NetPulse AI
                      </p>
                      <p className="truncate text-base font-semibold text-white">
                        Operations Console
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Navigation
                  </p>
                  <div className="mt-2">
                    <DashboardNav orientation="vertical" tone="sidebar" />
                  </div>
                </div>

                <div className="border-t border-white/8 pt-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                    <p className="truncate text-sm font-medium text-slate-100">{userEmail}</p>
                    <p className="mt-1 text-xs text-slate-400">Authenticated workspace</p>
                  </div>
                  <form action={signOutAction} className="mt-3">
                    <Button
                      className="w-full justify-start border-white/12 bg-white/[0.05] text-white hover:bg-white/[0.08] hover:text-white"
                      type="submit"
                      variant="outline"
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </aside>

          <div className="min-w-0 space-y-4">
            <Card className="overflow-hidden border-[#0d2330]/10 bg-[#081722] text-white shadow-[0_28px_80px_-60px_rgba(8,23,34,0.95)] lg:hidden">
              <CardContent className="space-y-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white">
                      <RadioTower className="size-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        NetPulse AI
                      </p>
                      <p className="text-base font-semibold text-white">Operations Console</p>
                    </div>
                  </div>
                  <form action={signOutAction}>
                    <Button
                      className="border-white/12 bg-white/[0.05] text-white hover:bg-white/[0.08] hover:text-white"
                      size="sm"
                      type="submit"
                      variant="outline"
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </Button>
                  </form>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3">
                  <p className="truncate text-sm font-medium text-slate-100">{userEmail}</p>
                  <p className="mt-1 text-xs text-slate-400">Authenticated workspace</p>
                </div>
                <DashboardNav orientation="horizontal" tone="surface" />
              </CardContent>
            </Card>

            <DashboardPageHeader />

            {children}
          </div>
        </div>
      </main>
    </AppProviders>
  );
}
