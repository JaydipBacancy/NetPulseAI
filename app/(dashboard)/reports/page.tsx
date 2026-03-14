import { OpsReport } from "@/components/reports/ops-report";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getReportsPageData } from "@/lib/data/reports";

async function loadReportsPageData() {
  try {
    return await getReportsPageData();
  } catch {
    return null;
  }
}

export default async function ReportsPage() {
  const reportsPageData = await loadReportsPageData();

  if (!reportsPageData) {
    return (
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle>Reports data unavailable</CardTitle>
          <CardDescription>
            We could not assemble the operations report data from Supabase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Verify your database connection and refresh the page.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <OpsReport data={reportsPageData} />;
}
