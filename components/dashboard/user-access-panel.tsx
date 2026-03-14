import Link from "next/link";
import {
  formatAppRole,
  type AppRole,
} from "@/lib/access-control";
import { UserAccessRowActions } from "@/components/dashboard/user-access-row-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UserManagementData } from "@/types/access";

const utcDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

const roleBadgeClassNames: Record<AppRole, string> = {
  admin: "bg-primary/12 text-primary",
  operator: "bg-secondary text-secondary-foreground",
  viewer: "bg-muted text-muted-foreground",
};

function formatUtcDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return `${utcDateFormatter.format(date)} UTC`;
}

function SearchForm({ query }: { query?: string }) {
  return (
    <form
      action="/users"
      className="flex w-full max-w-3xl flex-col gap-2 sm:flex-row sm:items-center"
    >
      <Input
        className="min-w-0 sm:flex-1"
        defaultValue={query ?? ""}
        name="q"
        placeholder="Search user, email, role, or status"
      />
      <Button className="w-full shrink-0 sm:w-auto" type="submit">
        Search
      </Button>
      {query ? (
        <Button asChild className="w-full shrink-0 sm:w-auto" variant="outline">
          <Link href="/users">Clear</Link>
        </Button>
      ) : null}
    </form>
  );
}

export function UserAccessPanel({
  currentUserId,
  data,
}: {
  currentUserId: string;
  data: UserManagementData;
}) {
  const userCountLabel = `${data.rows.length} user${data.rows.length === 1 ? "" : "s"}`;

  return (
    <Card className="border-border/70 bg-card/90">
      <CardHeader>
        <CardTitle>User Access Management</CardTitle>
        <CardDescription>
          Search workspace profiles by name, email, role, or status, then manage
          access from one table.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SearchForm query={data.filters.query} />

        <p className="text-xs text-muted-foreground">
          {data.filters.query
            ? `${userCountLabel} found for "${data.filters.query}".`
            : `${data.totalUsers} users in workspace.`}
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Users {data.totalUsers}</Badge>
          <Badge variant="outline">Active {data.activeUserCount}</Badge>
          <Badge variant="outline">Active admins {data.activeAdminCount}</Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Admin Controls</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.length > 0 ? (
              data.rows.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="max-w-[18rem]">
                    <p className="font-medium">{user.fullName}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={roleBadgeClassNames[user.role]}>
                      {formatAppRole(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "secondary" : "outline"}>
                      {user.isActive ? "ACTIVE" : "DISABLED"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatUtcDate(user.createdAt)}</TableCell>
                  <TableCell className="min-w-[20rem]">
                    <UserAccessRowActions
                      canEdit={user.id !== currentUserId}
                      user={user}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="py-8 text-center text-sm text-muted-foreground" colSpan={5}>
                  No users match the current search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
