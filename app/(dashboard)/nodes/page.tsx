import { NodeInventoryTable } from "@/components/nodes/node-inventory-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getNodesInventoryData } from "@/lib/data/nodes";
import type {
  NodeStatus,
  NodesFilters,
  NodesSortBy,
  SortOrder,
} from "@/types/nodes";

type SearchParams = Record<string, string | string[] | undefined>;

type NodesPageProps = {
  searchParams?: Promise<SearchParams> | SearchParams;
};

const nodeStatuses: NodeStatus[] = ["online", "degraded", "offline", "maintenance"];
const nodeSortByOptions: NodesSortBy[] = [
  "name",
  "vendor",
  "status",
  "region",
  "network_slice",
  "latency_ms",
  "throughput_mbps",
  "packet_loss_pct",
  "jitter_ms",
];
const sortOrders: SortOrder[] = ["asc", "desc"];

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

function parseFilters(params: SearchParams): NodesFilters {
  const query = getSingleParam(params.q);
  const vendor = getSingleParam(params.vendor);
  const networkSlice = getSingleParam(params.slice);
  const statusValue = getSingleParam(params.status);
  const sortByValue = getSingleParam(params.sort);
  const sortOrderValue = getSingleParam(params.order);
  const pageValue = getSingleParam(params.page);
  const status = nodeStatuses.includes(statusValue as NodeStatus)
    ? (statusValue as NodeStatus)
    : undefined;
  const sortBy = nodeSortByOptions.includes(sortByValue as NodesSortBy)
    ? (sortByValue as NodesSortBy)
    : "name";
  const sortOrder = sortOrders.includes(sortOrderValue as SortOrder)
    ? (sortOrderValue as SortOrder)
    : "asc";

  return {
    networkSlice: networkSlice?.trim() || undefined,
    page: parsePositiveInteger(pageValue, 1),
    pageSize: 10,
    query: query?.trim() || undefined,
    sortBy,
    sortOrder,
    status,
    vendor: vendor?.trim() || undefined,
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

  return <NodeInventoryTable data={nodesInventory} />;
}
