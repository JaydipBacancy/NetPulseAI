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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  NodesFilters,
  NodesInventoryData,
  NodesSortBy,
  SortOrder,
} from "@/types/nodes";

type NodesInventoryTableProps = {
  data: NodesInventoryData;
};

const statusBadgeClassNames = {
  degraded: "bg-secondary text-secondary-foreground",
  maintenance: "bg-primary/12 text-primary",
  offline: "bg-destructive/15 text-destructive",
  online: "bg-primary/12 text-primary",
} as const;

function buildNodesHref(filters: NodesFilters, updates: Partial<NodesFilters>) {
  const nextFilters = {
    ...filters,
    ...updates,
  };
  const params = new URLSearchParams();

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

  params.set("sort", nextFilters.sortBy);
  params.set("order", nextFilters.sortOrder);
  params.set("page", String(nextFilters.page));

  const query = params.toString();
  return query ? `/nodes?${query}` : "/nodes";
}

function createSortHref(
  filters: NodesFilters,
  targetSort: NodesSortBy,
) {
  const nextOrder: SortOrder =
    filters.sortBy === targetSort && filters.sortOrder === "asc" ? "desc" : "asc";

  return buildNodesHref(filters, {
    page: 1,
    sortBy: targetSort,
    sortOrder: nextOrder,
  });
}

function renderSortLabel(filters: NodesFilters, targetSort: NodesSortBy, label: string) {
  if (filters.sortBy !== targetSort) {
    return label;
  }

  return `${label} (${filters.sortOrder})`;
}

function formatMetric(value: number | null, unit: string) {
  if (value === null) {
    return "--";
  }

  return `${value} ${unit}`;
}

function SearchForm({ filters }: { filters: NodesFilters }) {
  return (
    <form action="/nodes" className="flex flex-wrap items-center gap-2">
      <Input defaultValue={filters.query ?? ""} name="q" placeholder="Search node, site, region, vendor" />
      <input name="sort" type="hidden" value={filters.sortBy} />
      <input name="order" type="hidden" value={filters.sortOrder} />
      {filters.vendor ? <input name="vendor" type="hidden" value={filters.vendor} /> : null}
      {filters.networkSlice ? (
        <input name="slice" type="hidden" value={filters.networkSlice} />
      ) : null}
      {filters.status ? <input name="status" type="hidden" value={filters.status} /> : null}
      <Button size="sm" type="submit">
        Search
      </Button>
    </form>
  );
}

function FilterGroup({
  activeValue,
  allHref,
  label,
  options,
  valueHref,
}: {
  activeValue?: string;
  allHref: string;
  label: string;
  options: string[];
  valueHref: (value: string) => string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant={!activeValue ? "default" : "outline"}>
          <Link href={allHref}>All</Link>
        </Button>
        {options.map((option) => (
          <Button
            asChild
            key={option}
            size="sm"
            variant={activeValue === option ? "default" : "outline"}
          >
            <Link href={valueHref(option)}>{option}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
}

export function NodeInventoryTable({ data }: NodesInventoryTableProps) {
  const previousPageHref = buildNodesHref(data.filters, {
    page: Math.max(1, data.filters.page - 1),
  });
  const nextPageHref = buildNodesHref(data.filters, {
    page: Math.min(data.pagination.totalPages, data.filters.page + 1),
  });

  return (
    <Card className="border-border/70 bg-card/90">
      <CardHeader className="space-y-3">
        <div>
          <div>
            <CardTitle>Node Inventory</CardTitle>
            <CardDescription className="mt-1">
              CRUD, filtering, sorting, and pagination for network node management.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <CreateNodeForm />

        <SearchForm filters={data.filters} />

        <div className="grid gap-4">
          <FilterGroup
            activeValue={data.filters.vendor}
            allHref={buildNodesHref(data.filters, { page: 1, vendor: undefined })}
            label="Vendor"
            options={data.options.vendors}
            valueHref={(vendor) => buildNodesHref(data.filters, { page: 1, vendor })}
          />
          <FilterGroup
            activeValue={data.filters.networkSlice}
            allHref={buildNodesHref(data.filters, { networkSlice: undefined, page: 1 })}
            label="Network Slice"
            options={data.options.networkSlices}
            valueHref={(networkSlice) =>
              buildNodesHref(data.filters, { networkSlice, page: 1 })
            }
          />
          <FilterGroup
            activeValue={data.filters.status}
            allHref={buildNodesHref(data.filters, { page: 1, status: undefined })}
            label="Node Status"
            options={data.options.statuses}
            valueHref={(status) =>
              buildNodesHref(data.filters, {
                page: 1,
                status: status as NodesFilters["status"],
              })
            }
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Link
                  className="font-medium text-foreground hover:text-primary"
                  href={createSortHref(data.filters, "name")}
                >
                  {renderSortLabel(data.filters, "name", "Node Name")}
                </Link>
              </TableHead>
              <TableHead>Location</TableHead>
              <TableHead>
                <Link
                  className="font-medium text-foreground hover:text-primary"
                  href={createSortHref(data.filters, "vendor")}
                >
                  {renderSortLabel(data.filters, "vendor", "Vendor")}
                </Link>
              </TableHead>
              <TableHead>Network Slice</TableHead>
              <TableHead>
                <Link
                  className="font-medium text-foreground hover:text-primary"
                  href={createSortHref(data.filters, "status")}
                >
                  {renderSortLabel(data.filters, "status", "Status")}
                </Link>
              </TableHead>
              <TableHead className="text-right">
                <Link
                  className="font-medium text-foreground hover:text-primary"
                  href={createSortHref(data.filters, "latency_ms")}
                >
                  {renderSortLabel(data.filters, "latency_ms", "Latency")}
                </Link>
              </TableHead>
              <TableHead className="text-right">
                <Link
                  className="font-medium text-foreground hover:text-primary"
                  href={createSortHref(data.filters, "throughput_mbps")}
                >
                  {renderSortLabel(data.filters, "throughput_mbps", "Throughput")}
                </Link>
              </TableHead>
              <TableHead className="text-right">Packet Loss</TableHead>
              <TableHead className="text-right">Jitter</TableHead>
              <TableHead>Actions</TableHead>
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
                    <NodeRowActions
                      availabilityPct={row.availabilityPct}
                      nodeId={row.id}
                      status={row.status}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="py-8 text-center text-sm text-muted-foreground" colSpan={10}>
                  No nodes match the selected filters.
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
