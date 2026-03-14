import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  Bot,
  ChartNoAxesCombined,
  FileText,
  LayoutDashboard,
  LogOut,
  RadioTower,
  TestTube2,
  type LucideIcon,
} from "lucide-react";
import { signOutAction } from "@/app/actions/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { MarketingAssetUrls } from "@/lib/marketing/assets";

const featureCards: Array<{
  description: string;
  icon: LucideIcon;
  title: string;
}> = [
  {
    description:
      "Monitor node health, KPI drift, and operational posture from one workspace.",
    icon: ChartNoAxesCombined,
    title: "Monitoring",
  },
  {
    description:
      "Track threshold-based incidents with node, severity, and status context.",
    icon: BellRing,
    title: "Alerts",
  },
  {
    description:
      "Run predefined telecom checks and keep pass or fail history attached to the workflow.",
    icon: TestTube2,
    title: "Predefined Tests",
  },
  {
    description:
      "Review AI-backed analysis and operational reports grounded in real node data.",
    icon: Bot,
    title: "Analysis and Reports",
  },
];

const quickStats = [
  { label: "Core KPIs", value: "Latency, throughput, packet loss, jitter" },
  { label: "Alert model", value: "Critical, warning, info" },
  { label: "Testing", value: "Predefined and persisted runs" },
];

type MarketingHomeProps = {
  assets: MarketingAssetUrls;
  viewer: MarketingViewer | null;
};

export type MarketingViewer = {
  email: string;
  fullName: string | null;
  isActive: boolean;
};

function buildAccessSummary(viewer: MarketingViewer | null) {
  if (!viewer) {
    return {
      badge: "Private workspace",
      description:
        "Sign in to access the protected NetPulse workspace, or create an account and wait for admin approval.",
      title: "Authentication and role-based access are built into the product.",
    };
  }

  if (viewer.isActive) {
    return {
      badge: "Workspace active",
      description:
        "Your account already has access to the operations console. Open the dashboard to continue your current workflow.",
      title: "You can move directly into the product workspace.",
    };
  }

  return {
    badge: "Access review",
    description:
      "You are signed in, but an admin still needs to activate your workspace access before you can open the dashboard.",
    title: "Your account exists, but workspace approval is still pending.",
  };
}

export function MarketingHome({ assets, viewer }: MarketingHomeProps) {
  const accessSummary = buildAccessSummary(viewer);

  return (
    <main className="dashboard-theme min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="rounded-[1.35rem] border border-border/70 bg-card/90 shadow-[0_18px_50px_-38px_rgba(9,22,41,0.24)]">
          <div className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <Link className="flex items-center gap-3" href="/">
              <div className="flex size-11 items-center justify-center rounded-[1.1rem] border border-primary/20 bg-primary/12 text-primary">
                <RadioTower className="size-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  NetPulse AI
                </p>
                <p className="text-base font-semibold text-foreground">
                  5G Network Operations Workspace
                </p>
              </div>
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <HeaderActions viewer={viewer} />
            </div>
          </div>
        </header>

        <section className="grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-center">
          <div className="space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Telecom monitoring, alerts, tests, and reporting
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-balance sm:text-5xl">
              NetPulse AI gives telecom teams one place to monitor, validate, analyze, and report.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground">
              This workspace is built around a practical 5G operations flow: dashboard
              monitoring, node inventory, alert review, predefined tests, AI analysis,
              and operational reports.
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              {quickStats.map((stat) => (
                <Card
                  className="rounded-[1.25rem] border-border/70 bg-card/88 p-4 shadow-[0_20px_60px_-48px_rgba(16,32,51,0.2)]"
                  key={stat.label}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">{stat.value}</p>
                </Card>
              ))}
            </div>
          </div>

          <Card className="overflow-hidden rounded-[1.6rem] border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(242,247,252,0.98))] shadow-[0_34px_90px_-58px_rgba(16,32,51,0.34)]">
            <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Product preview
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  Operations command board
                </p>
              </div>
              <Badge className="border-primary/25 bg-primary/10 text-primary" variant="outline">
                Live product style
              </Badge>
            </div>

            <Image
              alt="NetPulse AI operations dashboard preview"
              className="h-[320px] w-full object-cover"
              height={960}
              priority
              sizes="(min-width: 1024px) 28rem, 100vw"
              src={assets.hero}
              width={1400}
            />

            <div className="grid gap-3 border-t border-border/70 p-4">
              <PreviewRow
                icon={LayoutDashboard}
                label="Dashboard"
                text="Health score, KPI cards, alert counts, latest test result, and AI summary."
              />
              <PreviewRow
                icon={BellRing}
                label="Alerts"
                text="Severity-linked incidents with threshold context and node mapping."
              />
              <PreviewRow
                icon={FileText}
                label="Reports"
                text="Operational summaries designed for review and handoff."
              />
            </div>
          </Card>
        </section>

        <section className="py-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature) => {
              const Icon = feature.icon;

              return (
                <Card
                  className="rounded-[1.4rem] border-border/70 bg-card/90 p-5 shadow-[0_24px_70px_-56px_rgba(16,32,51,0.22)]"
                  key={feature.title}
                >
                  <div className="flex size-11 items-center justify-center rounded-[1.05rem] border border-primary/20 bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <p className="mt-4 text-lg font-semibold text-foreground">{feature.title}</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="py-10">
          <Card className="rounded-[1.6rem] border-border/70 bg-card/92 p-6 shadow-[0_26px_80px_-60px_rgba(16,32,51,0.26)] sm:p-7">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                  Access
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                  {accessSummary.title}
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                  {accessSummary.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <FooterActions viewer={viewer} />
              </div>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}

function PreviewRow({
  icon: Icon,
  label,
  text,
}: {
  icon: LucideIcon;
  label: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-[1.1rem] border border-border/70 bg-background/76 p-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-[0.95rem] border border-primary/18 bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

function HeaderActions({ viewer }: { viewer: MarketingViewer | null }) {
  if (viewer?.isActive) {
    return (
      <>
        <Button asChild size="sm">
          <Link href="/dashboard">
            Dashboard
            <LayoutDashboard className="size-4" />
          </Link>
        </Button>
        <SignOutButton size="sm" />
      </>
    );
  }

  if (viewer) {
    return <SignOutButton size="sm" />;
  }

  return (
    <>
      <Button asChild size="sm" variant="outline">
        <Link href="/signin">Sign in</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/signup">
          Create account
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </>
  );
}

function FooterActions({ viewer }: { viewer: MarketingViewer | null }) {
  if (viewer?.isActive) {
    return (
      <>
        <Button asChild>
          <Link href="/dashboard">
            Open dashboard
            <LayoutDashboard className="size-4" />
          </Link>
        </Button>
        <SignOutButton size="default" />
      </>
    );
  }

  if (viewer) {
    return <SignOutButton size="default" />;
  }

  return (
    <>
      <Button asChild variant="outline">
        <Link href="/signin">Sign in</Link>
      </Button>
      <Button asChild>
        <Link href="/signup">
          Create account
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </>
  );
}

function SignOutButton({ size }: { size: "default" | "sm" }) {
  return (
    <form action={signOutAction}>
      <input name="redirectTo" type="hidden" value="/" />
      <Button size={size} type="submit" variant="outline">
        <LogOut className="size-4" />
        Sign out
      </Button>
    </form>
  );
}
