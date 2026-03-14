import type { Database } from "@/types/supabase";

export type ReportsPageData = {
  alertsSummary: {
    critical: number;
    info: number;
    openCount: number;
    recentTitles: string[];
    warning: number;
  };
  generatedAt: string;
  healthSummary: {
    networkHealthScore: number;
    scoreBand: "critical" | "stable" | "watch";
  };
  latestAnalysis:
    | {
        generatedAt: string;
        nodeName: string;
        recommendations: string[];
        riskLevel: Database["public"]["Enums"]["risk_level_enum"];
        summary: string;
        title: string;
      }
    | null;
  latestTestOutcomes: {
    latestRuns: Array<{
      executedAt: string;
      nodeName: string;
      status: Database["public"]["Enums"]["test_result_status_enum"];
      testName: string;
    }>;
    passCount: number;
    recentRunCount: number;
    failCount: number;
  };
  operationalRecommendations: string[];
};
