import type { ReactNode } from "react";
import Link from "next/link";
import { RadioTower } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthShellProps = {
  children: ReactNode;
  description: string;
  eyebrow: string;
  footerHref: string;
  footerLabel: string;
  footerPrompt: string;
  title: string;
};

export function AuthShell({
  children,
  description,
  eyebrow,
  footerHref,
  footerLabel,
  footerPrompt,
  title,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_28rem]">
        <section className="rounded-[2rem] border border-border/70 bg-card/80 p-8 shadow-[0_25px_80px_-48px_rgba(7,29,55,0.75)] backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-primary/12 text-primary hover:bg-primary/12">
              Authentication
            </Badge>
            <Badge variant="secondary">Phase 3</Badge>
          </div>

          <div className="mt-10 max-w-3xl space-y-6">
            <div className="flex size-14 items-center justify-center rounded-3xl bg-primary/12 text-primary">
              <RadioTower className="size-6" />
            </div>
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.32em] text-muted-foreground">
                NetPulse AI
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
                Telecom operations access for the hackathon control plane.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                Secure the monitoring workspace before building the dashboard,
                nodes, alerts, tests, analysis, and reports experiences.
              </p>
            </div>
          </div>
        </section>

        <Card className="border-border/70 bg-card/90">
          <CardHeader className="gap-4">
            <div className="space-y-1">
              <CardDescription>{eyebrow}</CardDescription>
              <CardTitle className="text-2xl">{title}</CardTitle>
            </div>
            <CardDescription className="text-sm leading-6">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {children}
            <p className="text-sm text-muted-foreground">
              {footerPrompt}{" "}
              <Link className="font-medium text-primary" href={footerHref}>
                {footerLabel}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
