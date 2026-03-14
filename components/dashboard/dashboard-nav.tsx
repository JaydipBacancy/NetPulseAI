"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellRing,
  Bot,
  ChartNoAxesCombined,
  FileText,
  type LucideIcon,
  RadioTower,
  ServerCog,
  Users,
} from "lucide-react";
import { dashboardNavigation } from "@/lib/data/dashboard-navigation";
import { cn } from "@/lib/utils";

const navIconMap: Record<string, LucideIcon> = {
  "/alerts": BellRing,
  "/analysis": Bot,
  "/dashboard": ChartNoAxesCombined,
  "/nodes": RadioTower,
  "/reports": FileText,
  "/tests": ServerCog,
  "/users": Users,
} as const;

type DashboardNavProps = {
  canManageUsers?: boolean;
  orientation: "horizontal" | "vertical";
  tone?: "sidebar" | "surface";
};

function isRouteActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardNav({
  canManageUsers = false,
  orientation,
  tone,
}: DashboardNavProps) {
  const pathname = usePathname();
  const isVertical = orientation === "vertical";
  const activeTone = tone ?? (isVertical ? "sidebar" : "surface");
  const isSidebarTone = activeTone === "sidebar";
  const navigationItems = dashboardNavigation.filter(
    (item) => !item.requiresAdmin || canManageUsers,
  );

  return (
    <nav
      className={cn(
        isVertical
          ? "grid gap-1.5"
          : "grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4",
      )}
    >
      {navigationItems.map((item) => {
        const Icon = navIconMap[item.href];
        const active = isRouteActive(pathname, item.href);

        return (
          <Link
            className={cn(
              "group relative flex items-center gap-3 rounded-2xl border transition-all duration-200",
              isVertical
                ? "px-3.5 py-3"
                : "min-h-11 border-border/60 bg-background/72 px-3 py-2.5",
              isSidebarTone
                ? active
                  ? "border-primary/18 bg-primary/12 text-primary"
                  : "border-transparent text-foreground/80 hover:bg-background/80 hover:text-foreground"
                : active
                  ? "border-primary/22 bg-primary/12 text-primary"
                  : "border-border/60 text-muted-foreground hover:border-border/80 hover:bg-background/90 hover:text-foreground",
            )}
            key={item.href}
            href={item.href}
          >
            <span
              className={cn(
                "flex items-center justify-center rounded-2xl border transition-colors",
                isVertical ? "size-9" : "size-8",
                isSidebarTone
                  ? active
                    ? "border-primary/35 bg-primary text-primary-foreground"
                    : "border-border/60 bg-background/78 text-muted-foreground group-hover:text-foreground"
                  : active
                    ? "border-primary/35 bg-primary text-primary-foreground"
                    : "border-border/60 bg-secondary/70 text-muted-foreground group-hover:text-foreground",
              )}
            >
              <Icon className={isVertical ? "size-[18px]" : "size-4"} />
            </span>
            <span
              className={cn(
                "min-w-0",
                "text-sm font-medium",
              )}
            >
              <span
                className={cn(
                  isVertical ? "font-semibold" : "",
                  isSidebarTone && !active && "text-foreground/85",
                )}
              >
                {item.label}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
