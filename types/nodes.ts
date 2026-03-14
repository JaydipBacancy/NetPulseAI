import type { Database } from "@/types/supabase";

export type NodeStatus = Database["public"]["Enums"]["node_status_enum"];

export type NodesFilters = {
  networkSlice?: string;
  page: number;
  pageSize: number;
  query?: string;
  status?: NodeStatus;
  vendor?: string;
};

export type NodeInventoryRow = {
  availabilityPct: number;
  id: string;
  jitterMs: number | null;
  latencyMs: number | null;
  name: string;
  networkSlice: string;
  packetLossPct: number | null;
  region: string;
  siteCode: string;
  status: NodeStatus;
  throughputMbps: number | null;
  vendor: string;
};

type BaseNodeFormState<FieldName extends string> = {
  fieldErrors: Partial<Record<FieldName, string[]>>;
  message: string;
  status: "idle" | "server_error" | "success" | "validation_error";
  submittedAt?: string;
  values: Partial<Record<FieldName, string>>;
};

export type CreateNodeFieldName =
  | "availabilityPct"
  | "name"
  | "networkSlice"
  | "nodeType"
  | "region"
  | "siteCode"
  | "softwareVersion"
  | "status"
  | "vendor";

export type CreateNodeFormState = BaseNodeFormState<CreateNodeFieldName>;

export type NodeFilterOptions = {
  networkSlices: string[];
  statuses: NodeStatus[];
  vendors: string[];
};

export type NodesPagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type NodesInventoryData = {
  filters: NodesFilters;
  options: NodeFilterOptions;
  pagination: NodesPagination;
  rows: NodeInventoryRow[];
};
