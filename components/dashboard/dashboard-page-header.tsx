"use client";

import { usePathname } from "next/navigation";
import {
  BellRing,
  Bot,
  ChartNoAxesCombined,
  FileText,
  RadioTower,
  ServerCog,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type HeaderMeta = {
  description: string;
  icon: LucideIcon;
  tags: string[];
  title: string;
};

const headerMetaByRoute: Record<string, HeaderMeta> = {
  "/alerts": {
    description: "Track incidents by severity, status, and trigger context.",
    icon: BellRing,
    tags: ["Severity triage", "Node-linked incidents", "Resolution tracking"],
    title: "Alert Center",
  },
  "/analysis": {
    description: "Review AI risk reports, causes, and operator recommendations.",
    icon: Bot,
    tags: ["Likely causes", "Risk levels", "Operator guidance"],
    title: "AI Analysis",
  },
  "/dashboard": {
    description: "Monitor network health, key KPIs, and latest operational shifts.",
    icon: ChartNoAxesCombined,
    tags: ["Health scoring", "Recent KPIs", "Live workspace"],
    title: "Operations Overview",
  },
  "/nodes": {
    description: "Manage node inventory, availability, and network-slice coverage.",
    icon: RadioTower,
    tags: ["Inventory control", "Slice coverage", "Status management"],
    title: "Node Management",
  },
  "/reports": {
    description: "Summarize metrics, alerts, tests, and AI outcomes in one place.",
    icon: FileText,
    tags: ["Operational summary", "Cross-module context", "Handoff-ready"],
    title: "Operational Reports",
  },
  "/tests": {
    description: "Run predefined cases and audit pass/fail execution history.",
    icon: ServerCog,
    tags: ["Predefined cases", "Execution history", "Auditable results"],
    title: "Test Runner",
  },
  "/users": {
    description: "Manage workspace roles, activation status, and user access governance.",
    icon: Users,
    tags: ["Role governance", "Admin controls", "Workspace access"],
    title: "User Management",
  },
};

function getHeaderMeta(pathname: string): HeaderMeta {
  const matchedRoute =
    Object.keys(headerMetaByRoute).find(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    ) ?? "/dashboard";

  return headerMetaByRoute[matchedRoute];
}

export function DashboardPageHeader() {
  const pathname = usePathname();
  const meta = getHeaderMeta(pathname);
  const Icon = meta.icon;

  return (
    <Card className="relative overflow-hidden border-border/70 bg-gradient-to-r from-card via-card to-accent/35 shadow-[0_22px_70px_-58px_rgba(15,23,42,0.16)]">
      <div className="pointer-events-none absolute -right-12 top-0 h-32 w-56 rounded-full bg-primary/12 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-[-3rem] h-36 w-52 rounded-full bg-accent/40 blur-3xl" />
      <CardContent className="relative space-y-4 p-5 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-11 items-center justify-center rounded-2xl border border-primary/25 bg-primary/12 text-primary">
              <Icon className="size-5" />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                NetPulse Workspace
              </p>
              <h1 className="text-2xl font-semibold leading-tight">{meta.title}</h1>
              <p className="max-w-2xl text-sm text-muted-foreground">{meta.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {meta.tags.map((tag) => (
              <Badge
                className="border border-border/70 bg-background/80 text-foreground"
                key={tag}
                variant="outline"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
