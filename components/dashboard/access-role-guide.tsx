import {
  formatAppRole,
  roleDefinitions,
  type AppRole,
} from "@/lib/access-control";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const roleCardClassNames: Record<AppRole, string> = {
  admin: "border-primary/30 bg-primary/5",
  operator: "border-border/70 bg-background/70",
  viewer: "border-border/70 bg-background/70",
};

export function AccessRoleGuide({ currentRole }: { currentRole: AppRole }) {
  const orderedRoles: AppRole[] = ["admin", "operator", "viewer"];

  return (
    <Card className="border-border/70 bg-card/90">
      <CardHeader>
        <CardTitle>Workspace Roles</CardTitle>
        <CardDescription>
          Current access model for this NetPulse workspace. New signups stay safe by
          default, and admins promote users only when they need operational access.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-3">
        {orderedRoles.map((role) => {
          const definition = roleDefinitions[role];
          const isCurrentRole = currentRole === role;

          return (
            <div
              className={`rounded-2xl border p-4 ${roleCardClassNames[role]}`}
              key={role}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-semibold">{definition.label}</p>
                {isCurrentRole ? <Badge>Current role</Badge> : null}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{definition.description}</p>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {definition.responsibilities.map((responsibility) => (
                  <li key={responsibility}>- {responsibility}</li>
                ))}
              </ul>
              {isCurrentRole ? (
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                  {formatAppRole(currentRole)} access is active for your current session.
                </p>
              ) : null}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
