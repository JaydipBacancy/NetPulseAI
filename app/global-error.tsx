"use client";

import { Button } from "@/components/ui/button";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-4 px-6 py-12">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              NetPulse AI
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">
              The workspace hit an unexpected error. Try the request again or return
              to the dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => reset()} type="button">
              Try again
            </Button>
            <Button asChild variant="outline">
              <a href="/dashboard">Open dashboard</a>
            </Button>
          </div>

          {error.digest ? (
            <p className="text-xs text-muted-foreground">Reference: {error.digest}</p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
