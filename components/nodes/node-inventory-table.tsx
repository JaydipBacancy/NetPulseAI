import Link from "next/link";
import { CreateNodeForm } from "@/components/nodes/create-node-form";
import { NodeRowActions } from "@/components/nodes/node-row-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { NodesFilters, NodesInventoryData } from "@/types/nodes";

type NodesInventoryTableProps = {
  canManageOperations: boolean;
  data: NodesInventoryData;
};

const statusBadgeClassNames = {
  degraded: "bg-secondary text-secondary-foreground",
  maintenance: "bg-primary/12 text-primary",
  offline: "bg-destructive/15 text-destructive",
  online: "bg-primary/12 text-primary",
} as const;

function formatMetric(value: number | null, unit: string) {
  if (value === null) {
    return "--";
  }

  return `${value} ${unit}`;
}

function formatAvailability(value: number) {
  return `${value.toFixed(2)}%`;
}

function buildNodesHref(filters: NodesFilters, updates: Partial<NodesFilters>) {
  const nextFilters = {
    ...filters,
    ...updates,
  };
  const params = new URLSearchParams();

  params.set("page", String(nextFilters.page));

  if (nextFilters.vendor) {
    params.set("vendor", nextFilters.vendor);
  }

  if (nextFilters.networkSlice) {
    params.set("slice", nextFilters.networkSlice);
  }

  if (nextFilters.status) {
    params.set("status", nextFilters.status);
  }

  if (nextFilters.query) {
    params.set("q", nextFilters.query);
  }

  const query = params.toString();
  return query ? `/nodes?${query}` : "/nodes";
}

function SearchForm({ filters }: { filters: NodesFilters }) {
  const clearHref = buildNodesHref(filters, {
    page: 1,
    query: undefined,
  });

  return (
    <form
      action="/nodes"
      className="flex w-full max-w-3xl flex-col gap-2 sm:flex-row sm:items-center"
    >
      <Input
        className="min-w-0 sm:flex-1"
        defaultValue={filters.query ?? ""}
        name="q"
        placeholder="Search node, site, region, vendor, or slice"
      />
      <input name="page" type="hidden" value="1" />
      {filters.vendor ? <input name="vendor" type="hidden" value={filters.vendor} /> : null}
      {filters.networkSlice ? (
        <input name="slice" type="hidden" value={filters.networkSlice} />
      ) : null}
      {filters.status ? <input name="status" type="hidden" value={filters.status} /> : null}
      <Button className="w-full shrink-0 sm:w-auto" type="submit">
        Search
      </Button>
      {filters.query ? (
        <Button asChild className="w-full shrink-0 sm:w-auto" variant="outline">
          <Link href={clearHref}>Clear</Link>
        </Button>
      ) : null}
    </form>
  );
}

export function NodeInventoryTable({
  canManageOperations,
  data,
}: NodesInventoryTableProps) {
  const previousPageHref = buildNodesHref(data.filters, {
    page: Math.max(1, data.filters.page - 1),
  });
  const nextPageHref = buildNodesHref(data.filters, {
    page: Math.min(data.pagination.totalPages, data.filters.page + 1),
  });
  const vendorOptions = [
    {
      href: buildNodesHref(data.filters, { page: 1, vendor: undefined }),
      label: "All vendors",
      value: "all",
    },
    ...data.options.vendors.map((vendor) => ({
      href: buildNodesHref(data.filters, { page: 1, vendor }),
      label: vendor,
      value: vendor,
    })),
  ];
  const networkSliceOptions = [
    {
      href: buildNodesHref(data.filters, { networkSlice: undefined, page: 1 }),
      label: "All slices",
      value: "all",
    },
    ...data.options.networkSlices.map((networkSlice) => ({
      href: buildNodesHref(data.filters, { networkSlice, page: 1 }),
      label: networkSlice,
      value: networkSlice,
    })),
  ];
  const statusOptions = [
    {
      href: buildNodesHref(data.filters, { page: 1, status: undefined }),
      label: "All statuses",
      value: "all",
    },
    ...data.options.statuses.map((status) => ({
      href: buildNodesHref(data.filters, { page: 1, status }),
      label: status.toUpperCase(),
      value: status,
    })),
  ];

  return (
    <Card className="border-border/70 bg-card/90">
      <CardHeader className="space-y-3">
        <div>
          <CardTitle>Node Inventory</CardTitle>
          <CardDescription className="mt-1">
            Search the current network node inventory by node, site, region, vendor,
            or slice.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {canManageOperations ? (
          <CreateNodeForm />
        ) : (
          <p className="text-sm text-muted-foreground">
            Viewer access is read-only. Only operators and admins can create nodes.
          </p>
        )}

        <SearchForm filters={data.filters} />

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <FilterDropdown
            label="Vendor"
            options={vendorOptions}
            selectedValue={data.filters.vendor ?? "all"}
          />
          <FilterDropdown
            label="Network Slice"
            options={networkSliceOptions}
            selectedValue={data.filters.networkSlice ?? "all"}
          />
          <FilterDropdown
            label="Status"
            options={statusOptions}
            selectedValue={data.filters.status ?? "all"}
          />
          <div className="flex items-end">
            <Button asChild className="w-full md:w-auto" size="sm" variant="ghost">
              <Link href="/nodes">Reset</Link>
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Showing {data.rows.length} out of {data.pagination.totalItems} nodes
          {data.filters.query ? ` for "${data.filters.query}"` : ""}.
        </p>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Node Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Network Slice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Availability</TableHead>
              <TableHead className="text-right">Latency</TableHead>
              <TableHead className="text-right">Throughput</TableHead>
              <TableHead className="text-right">Packet Loss</TableHead>
              <TableHead className="text-right">Jitter</TableHead>
              <TableHead>{canManageOperations ? "Actions" : "Access"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.length > 0 ? (
              data.rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <p className="font-medium">{row.name}</p>
                    <p className="text-xs text-muted-foreground">{row.siteCode}</p>
                  </TableCell>
                  <TableCell>{row.region}</TableCell>
                  <TableCell>{row.vendor}</TableCell>
                  <TableCell>{row.networkSlice}</TableCell>
                  <TableCell>
                    <Badge className={statusBadgeClassNames[row.status]}>
                      {row.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatAvailability(row.availabilityPct)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatMetric(row.latencyMs, "ms")}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatMetric(row.throughputMbps, "Mbps")}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatMetric(row.packetLossPct, "%")}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatMetric(row.jitterMs, "ms")}
                  </TableCell>
                  <TableCell>
                    {canManageOperations ? (
                      <NodeRowActions
                        availabilityPct={row.availabilityPct}
                        nodeId={row.id}
                        status={row.status}
                      />
                    ) : (
                      <Badge variant="outline">Read only</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="py-8 text-center text-sm text-muted-foreground" colSpan={11}>
                  No nodes match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            Showing {data.rows.length} out of {data.pagination.totalItems} nodes
            {" | "}
            Page {data.pagination.page} of {data.pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              asChild
              disabled={data.pagination.page <= 1}
              size="sm"
              variant="outline"
            >
              <Link href={previousPageHref}>Previous</Link>
            </Button>
            <Button
              asChild
              disabled={data.pagination.page >= data.pagination.totalPages}
              size="sm"
              variant="outline"
            >
              <Link href={nextPageHref}>Next</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
