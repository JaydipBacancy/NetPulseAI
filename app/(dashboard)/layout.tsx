import type { ReactNode } from "react";
import { LogOut, RadioTower } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { AppProviders } from "@/components/providers/app-providers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatAppRole } from "@/lib/access-control";
import { requireAuthenticatedWorkspace } from "@/lib/supabase/rbac";

export const dynamic = "force-dynamic";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const access = await requireAuthenticatedWorkspace();
  const userEmail = access.authEmail || access.profile.email;
  const userName = access.profile.fullName;
  const userRole = formatAppRole(access.profile.role);

  return (
    <AppProviders className="dashboard-theme">
      <main className="min-h-screen bg-background px-3 py-3 sm:px-4 md:px-5 md:py-4">
        <div className="mx-auto grid w-full max-w-[1680px] gap-4 lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:gap-5">
          <aside className="hidden lg:sticky lg:top-4 lg:block lg:h-[calc(100vh-2rem)]">
            <Card className="flex h-full flex-col overflow-hidden border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(244,248,252,0.98))] text-foreground shadow-[0_32px_90px_-56px_rgba(15,23,42,0.18)]">
              <CardContent className="flex h-full flex-col gap-5 p-4">
                <div className="border-b border-border/70 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-[1.25rem] border border-primary/15 bg-primary/10 text-primary">
                      <RadioTower className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        NetPulse AI
                      </p>
                      <p className="truncate text-base font-semibold text-foreground">
                        Operations Console
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Navigation
                  </p>
                  <div className="mt-2">
                    <DashboardNav
                      canManageUsers={access.permissions.canManageUsers}
                      orientation="vertical"
                      tone="sidebar"
                    />
                  </div>
                </div>

                <div className="border-t border-border/70 pt-4">
                  <div className="rounded-2xl border border-border/70 bg-background/72 p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium text-foreground">{userName}</p>
                      <Badge className="border border-primary/15 bg-primary/10 text-primary hover:bg-primary/10">
                        {userRole}
                      </Badge>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{userEmail}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Authenticated workspace</p>
                  </div>
                  <form action={signOutAction} className="mt-3">
                    <Button
                      className="w-full justify-start border-border/70 bg-background/72 text-foreground hover:bg-accent hover:text-accent-foreground"
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
            <Card className="overflow-hidden border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(244,248,252,0.98))] text-foreground shadow-[0_28px_80px_-60px_rgba(15,23,42,0.16)] lg:hidden">
              <CardContent className="space-y-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                      <RadioTower className="size-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        NetPulse AI
                      </p>
                      <p className="text-base font-semibold text-foreground">Operations Console</p>
                    </div>
                  </div>
                  <form action={signOutAction}>
                    <Button
                      className="border-border/70 bg-background/72 text-foreground hover:bg-accent hover:text-accent-foreground"
                      size="sm"
                      type="submit"
                      variant="outline"
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </Button>
                  </form>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/72 px-3 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{userName}</p>
                    <Badge className="border border-primary/15 bg-primary/10 text-primary hover:bg-primary/10">
                      {userRole}
                    </Badge>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{userEmail}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Authenticated workspace</p>
                </div>
                <DashboardNav
                  canManageUsers={access.permissions.canManageUsers}
                  orientation="horizontal"
                  tone="surface"
                />
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
