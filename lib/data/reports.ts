import "server-only";

import type { AnalysisFilters } from "@/types/analysis";
import type { TestsFilters } from "@/types/tests";
import { getAnalysisPageData } from "@/lib/data/analysis";
import { getDashboardOverviewData } from "@/lib/data/dashboard";
import { getTestsPageData } from "@/lib/data/tests";
import type { ReportsPageData } from "@/types/reports";

function buildOperationalRecommendations(input: {
  criticalAlerts: number;
  failCount: number;
  latestAnalysisRecommendations: string[];
  openAlerts: number;
  passCount: number;
  scoreBand: ReportsPageData["healthSummary"]["scoreBand"];
}) {
  const recommendations: string[] = [];

  if (input.criticalAlerts > 0) {
    recommendations.push(
      "Escalate critical alert owners and keep immediate remediation windows active until critical incidents close.",
    );
  }

  if (input.failCount > input.passCount) {
    recommendations.push(
      "Prioritize rerunning failed predefined tests after network fixes to confirm recovery before demo handoff.",
    );
  }

  if (input.scoreBand === "critical") {
    recommendations.push(
      "Freeze non-essential changes and focus on restoring baseline latency, throughput, and packet-loss targets.",
    );
  } else if (input.scoreBand === "watch") {
    recommendations.push(
      "Maintain heightened monitoring over the next telemetry window and track alert movement by slice.",
    );
  } else {
    recommendations.push(
      "Network health is stable; keep a proactive test cadence to prevent regressions.",
    );
  }

  if (input.openAlerts === 0) {
    recommendations.push(
      "No open alerts are active. Use this window to validate resilience with one scheduled test run.",
    );
  }

  recommendations.push(...input.latestAnalysisRecommendations.slice(0, 2));

  return Array.from(new Set(recommendations)).slice(0, 5);
}

const reportsAnalysisFilters: AnalysisFilters = {
  page: 1,
  pageSize: 10,
  query: undefined,
  riskLevel: undefined,
  sortBy: "generated_at",
  sortOrder: "desc",
};

const reportsTestsFilters: TestsFilters = {
  caseActive: undefined,
  caseCategory: undefined,
  caseMetric: undefined,
  casePage: 1,
  casePageSize: 6,
  caseQuery: undefined,
  caseSortBy: "name",
  caseSortOrder: "asc",
  historyNodeId: undefined,
  historyPage: 1,
  historyPageSize: 20,
  historyQuery: undefined,
  historySortBy: "executed_at",
  historySortOrder: "desc",
  historyStatus: undefined,
};

export async function getReportsPageData(): Promise<ReportsPageData> {
  const [dashboardData, testsData, analysisData] = await Promise.all([
    getDashboardOverviewData(),
    getTestsPageData(reportsTestsFilters),
    getAnalysisPageData(reportsAnalysisFilters),
  ]);
  const latestAnalysis = analysisData.reports[0] ?? null;
  const latestRuns = testsData.history.rows.slice(0, 5);
  const passCount = latestRuns.filter((run) => run.status === "pass").length;
  const failCount = latestRuns.filter((run) => run.status === "fail").length;
  const operationalRecommendations = buildOperationalRecommendations({
    criticalAlerts: dashboardData.health.openSeverityCounts.critical,
    failCount,
    latestAnalysisRecommendations: latestAnalysis?.recommendations ?? [],
    openAlerts: dashboardData.health.activeAlertCount,
    passCount,
    scoreBand: dashboardData.health.scoreBand,
  });

  return {
    alertsSummary: {
      critical: dashboardData.health.openSeverityCounts.critical,
      info: dashboardData.health.openSeverityCounts.info,
      openCount: dashboardData.health.activeAlertCount,
      recentTitles: dashboardData.recentAlerts.slice(0, 3).map((alert) => alert.title),
      warning: dashboardData.health.openSeverityCounts.warning,
    },
    generatedAt: new Date().toISOString(),
    healthSummary: {
      networkHealthScore: dashboardData.health.networkHealthScore,
      scoreBand: dashboardData.health.scoreBand,
    },
    latestAnalysis: latestAnalysis
      ? {
          generatedAt: latestAnalysis.generatedAt,
          nodeName: latestAnalysis.nodeName,
          recommendations: latestAnalysis.recommendations,
          riskLevel: latestAnalysis.riskLevel,
          summary: latestAnalysis.summary,
          title: latestAnalysis.title,
        }
      : null,
    latestTestOutcomes: {
      failCount,
      latestRuns: latestRuns.map((run) => ({
        executedAt: run.executedAt,
        nodeName: run.nodeName,
        status: run.status,
        testName: run.testName,
      })),
      passCount,
      recentRunCount: latestRuns.length,
    },
    operationalRecommendations,
  };
}
