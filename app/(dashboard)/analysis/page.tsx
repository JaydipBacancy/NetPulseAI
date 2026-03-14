import { AnalysisConsole } from "@/components/analysis/analysis-console";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAnalysisPageData } from "@/lib/data/analysis";
import type { AnalysisFilters, AnalysisSortBy, SortOrder } from "@/types/analysis";

type SearchParams = Record<string, string | string[] | undefined>;

type AnalysisPageProps = {
  searchParams?: Promise<SearchParams> | SearchParams;
};

const sortByValues: AnalysisSortBy[] = ["generated_at", "risk_level", "title"];
const sortOrders: SortOrder[] = ["asc", "desc"];

function isRiskLevel(
  value: string | undefined,
): value is NonNullable<AnalysisFilters["riskLevel"]> {
  return value === "low" || value === "medium" || value === "high" || value === "critical";
}

function getSingleParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parsePositiveInteger(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseFilters(params: SearchParams): AnalysisFilters {
  const riskLevelValue = getSingleParam(params.risk);
  const sortByValue = getSingleParam(params.sort);
  const sortOrderValue = getSingleParam(params.order);
  const pageValue = getSingleParam(params.page);
  const riskLevel = isRiskLevel(riskLevelValue) ? riskLevelValue : undefined;
  const sortBy = sortByValues.includes(sortByValue as AnalysisSortBy)
    ? (sortByValue as AnalysisSortBy)
    : "generated_at";
  const sortOrder = sortOrders.includes(sortOrderValue as SortOrder)
    ? (sortOrderValue as SortOrder)
    : "desc";

  return {
    page: parsePositiveInteger(pageValue, 1),
    pageSize: 6,
    query: getSingleParam(params.q)?.trim() || undefined,
    riskLevel,
    sortBy,
    sortOrder,
  };
}

async function loadAnalysisPageData(filters: AnalysisFilters) {
  try {
    return await getAnalysisPageData(filters);
  } catch {
    return null;
  }
}

export default async function AnalysisPage({ searchParams }: AnalysisPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const filters = parseFilters(resolvedSearchParams);
  const analysisPageData = await loadAnalysisPageData(filters);

  if (!analysisPageData) {
    return (
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle>Analysis data unavailable</CardTitle>
          <CardDescription>
            We could not load analysis context or reports from Supabase.
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

  return <AnalysisConsole data={analysisPageData} />;
}
