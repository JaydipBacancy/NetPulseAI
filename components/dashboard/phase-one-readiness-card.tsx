import { PhaseOneCheckForm } from "@/components/dashboard/phase-one-check-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PhaseOneReadinessCardProps = {
  missingKeys: string[];
  summary: string;
  supabaseConfigured: boolean;
};

export function PhaseOneReadinessCard({
  missingKeys,
  summary,
  supabaseConfigured,
}: PhaseOneReadinessCardProps) {
  return (
    <Card className="border-border/70 bg-card/90">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant={supabaseConfigured ? "default" : "outline"}
            className={supabaseConfigured ? "" : "bg-background/80"}
          >
            {supabaseConfigured ? "Supabase env ready" : "Supabase env pending"}
          </Badge>
          <Badge variant="secondary">Server flows active</Badge>
        </div>
        <div className="space-y-1">
          <CardTitle>App-side backend scaffolding is live</CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-6">
            {summary}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!supabaseConfigured ? (
          <div className="rounded-2xl border border-border/70 bg-background/75 p-4 text-sm text-muted-foreground">
            Missing public env keys: {missingKeys.join(", ")}
          </div>
        ) : null}

        <PhaseOneCheckForm />
      </CardContent>
    </Card>
  );
}
