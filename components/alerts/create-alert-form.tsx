"use client";

import { useActionState, useState } from "react";
import { createAlertAction } from "@/app/actions/alerts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateAlertFormState } from "@/types/alerts";
import { toast } from "sonner";

const initialCreateAlertState: CreateAlertFormState = {
  fieldErrors: {},
  message: "",
  status: "idle",
  values: {},
};

const selectClassName =
  "flex h-11 w-full rounded-2xl border border-border/70 bg-card/92 px-4 py-2 text-sm text-foreground shadow-[0_12px_30px_-24px_rgba(15,23,42,0.18)] transition-colors [color-scheme:light] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60";

type CreateAlertFormProps = {
  nodes: Array<{ id: string; name: string }>;
};

export function CreateAlertForm({ nodes }: CreateAlertFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (previousState: CreateAlertFormState, formData: FormData) => {
      const nextState = await createAlertAction(previousState, formData);

      if (nextState.status === "success") {
        setIsModalOpen(false);
        toast.success(nextState.message);
      } else if (nextState.status === "server_error") {
        toast.error(nextState.message);
      }

      return nextState;
    },
    initialCreateAlertState,
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Button onClick={() => setIsModalOpen(true)} type="button">
          Create Alert
        </Button>
      </div>

      {isModalOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/60 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            aria-labelledby="create-alert-title"
            aria-modal="true"
            className="mx-auto mt-8 max-h-[86vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-border bg-background p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-base font-semibold" id="create-alert-title">
                Create Alert
              </p>
              <Button
                onClick={() => setIsModalOpen(false)}
                type="button"
                variant="outline"
              >
                Close
              </Button>
            </div>
            <form action={formAction} className="grid gap-4" noValidate>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="alert-node">Node</Label>
                  <select
                    className={selectClassName}
                    defaultValue={state.values.nodeId ?? ""}
                    id="alert-node"
                    name="nodeId"
                  >
                    <option value="">Select node</option>
                    {nodes.map((node) => (
                      <option key={node.id} value={node.id}>
                        {node.name}
                      </option>
                    ))}
                  </select>
                  {state.fieldErrors.nodeId?.[0] ? (
                    <p className="text-sm text-destructive">{state.fieldErrors.nodeId[0]}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alert-metricType">Metric Type</Label>
                  <select
                    className={selectClassName}
                    defaultValue={state.values.metricType || "latency_ms"}
                    id="alert-metricType"
                    name="metricType"
                  >
                    <option value="latency_ms">latency_ms</option>
                    <option value="throughput_mbps">throughput_mbps</option>
                    <option value="packet_loss_pct">packet_loss_pct</option>
                    <option value="jitter_ms">jitter_ms</option>
                  </select>
                  {state.fieldErrors.metricType?.[0] ? (
                    <p className="text-sm text-destructive">{state.fieldErrors.metricType[0]}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alert-severity">Severity</Label>
                  <select
                    className={selectClassName}
                    defaultValue={state.values.severity || "warning"}
                    id="alert-severity"
                    name="severity"
                  >
                    <option value="critical">critical</option>
                    <option value="warning">warning</option>
                    <option value="info">info</option>
                  </select>
                  {state.fieldErrors.severity?.[0] ? (
                    <p className="text-sm text-destructive">{state.fieldErrors.severity[0]}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alert-title">Title</Label>
                  <Input
                    defaultValue={state.values.title ?? ""}
                    id="alert-title"
                    name="title"
                    placeholder="Latency spike on core node"
                  />
                  {state.fieldErrors.title?.[0] ? (
                    <p className="text-sm text-destructive">{state.fieldErrors.title[0]}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alert-currentValue">Current Value</Label>
                  <Input
                    defaultValue={state.values.currentValue ?? ""}
                    id="alert-currentValue"
                    name="currentValue"
                    step="0.01"
                    type="number"
                  />
                  {state.fieldErrors.currentValue?.[0] ? (
                    <p className="text-sm text-destructive">{state.fieldErrors.currentValue[0]}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alert-thresholdValue">Threshold Value</Label>
                  <Input
                    defaultValue={state.values.thresholdValue ?? ""}
                    id="alert-thresholdValue"
                    name="thresholdValue"
                    step="0.01"
                    type="number"
                  />
                  {state.fieldErrors.thresholdValue?.[0] ? (
                    <p className="text-sm text-destructive">
                      {state.fieldErrors.thresholdValue[0]}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alert-summary">Summary</Label>
                <Input
                  defaultValue={state.values.summary ?? ""}
                  id="alert-summary"
                  name="summary"
                  placeholder="Include impact, expected threshold, and operational context."
                />
                {state.fieldErrors.summary?.[0] ? (
                  <p className="text-sm text-destructive">{state.fieldErrors.summary[0]}</p>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <Button disabled={pending} type="submit">
                  {pending ? "Creating..." : "Create alert"}
                </Button>
                <Button
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
