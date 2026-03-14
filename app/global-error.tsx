"use client";

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
            <button
              className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              onClick={() => reset()}
              type="button"
            >
              Try again
            </button>
            <a
              className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-medium text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              href="/dashboard"
            >
              Open dashboard
            </a>
          </div>

          {error.digest ? (
            <p className="text-xs text-muted-foreground">Reference: {error.digest}</p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
