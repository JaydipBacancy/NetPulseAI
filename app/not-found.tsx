export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-4 px-6 py-12">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          NetPulse AI
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The requested workspace page could not be found.
        </p>
      </div>
      <a
        className="inline-flex h-10 w-fit items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        href="/dashboard"
      >
        Open dashboard
      </a>
    </main>
  );
}
