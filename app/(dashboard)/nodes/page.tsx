import { NodeInventoryTable } from "@/components/nodes/node-inventory-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getNodesInventoryData } from "@/lib/data/nodes";
import { requireAuthenticatedWorkspace } from "@/lib/supabase/rbac";
import type { NodeStatus, NodesFilters } from "@/types/nodes";

type SearchParams = Record<string, string | string[] | undefined>;

type NodesPageProps = {
  searchParams?: Promise<SearchParams> | SearchParams;
};

const nodeStatuses: NodeStatus[] = [
  "online",
  "degraded",
  "offline",
  "maintenance",
];

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

  const parsedValue = Number.parseInt(value, 10);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

function parseFilters(params: SearchParams): NodesFilters {
  const query = getSingleParam(params.q);
  const vendor = getSingleParam(params.vendor)?.trim();
  const networkSlice = getSingleParam(params.slice)?.trim();
  const rawStatus = getSingleParam(params.status);
  const status = nodeStatuses.includes(rawStatus as NodeStatus)
    ? (rawStatus as NodeStatus)
    : undefined;
  const page = parsePositiveInteger(getSingleParam(params.page), 1);

  return {
    networkSlice: networkSlice || undefined,
    page,
    pageSize: 10,
    query: query?.trim() || undefined,
    status,
    vendor: vendor || undefined,
  };
}

async function loadNodesInventory(filters: NodesFilters) {
  try {
    return await getNodesInventoryData(filters);
  } catch {
    return null;
  }
}

export default async function NodesPage({ searchParams }: NodesPageProps) {
  const access = await requireAuthenticatedWorkspace();
  const resolvedSearchParams = (await searchParams) ?? {};
  const filters = parseFilters(resolvedSearchParams);
  const nodesInventory = await loadNodesInventory(filters);

  if (!nodesInventory) {
    return (
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle>Nodes data unavailable</CardTitle>
          <CardDescription>
            We could not load the node inventory from Supabase right now.
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

  return (
    <NodeInventoryTable
      canManageOperations={access.permissions.canManageOperations}
      data={nodesInventory}
    />
  );
}
