import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardOverviewData } from "@/lib/data/dashboard";

async function loadDashboardOverview() {
  try {
    return await getDashboardOverviewData();
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const dashboardData = await loadDashboardOverview();

  return (
    <div className="space-y-4">
      {dashboardData ? (
        <DashboardOverview data={dashboardData} />
      ) : (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle>Dashboard data unavailable</CardTitle>
            <CardDescription>
              We could not load the latest monitoring snapshot right now.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Verify your Supabase connection and refresh the page.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
