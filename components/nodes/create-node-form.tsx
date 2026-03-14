"use client";

import { useActionState, useState } from "react";
import { createNodeAction } from "@/app/actions/nodes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateNodeFormState } from "@/types/nodes";
import { toast } from "sonner";

const initialCreateNodeState: CreateNodeFormState = {
  fieldErrors: {},
  message: "",
  status: "idle",
  values: {},
};

const selectClassName =
  "flex h-11 w-full rounded-2xl border border-border/70 bg-card/92 px-4 py-2 text-sm text-foreground shadow-[0_12px_30px_-24px_rgba(15,23,42,0.18)] transition-colors [color-scheme:light] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60";

export function CreateNodeForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (previousState: CreateNodeFormState, formData: FormData) => {
      const nextState = await createNodeAction(previousState, formData);

      if (nextState.status === "success") {
        setIsModalOpen(false);
        toast.success(nextState.message);
      } else if (nextState.status === "server_error") {
        toast.error(nextState.message);
      }

      return nextState;
    },
    initialCreateNodeState,
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Button onClick={() => setIsModalOpen(true)} type="button">
          Create Node
        </Button>
      </div>

      {isModalOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/60 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            aria-labelledby="create-node-title"
            aria-modal="true"
            className="mx-auto mt-8 max-h-[86vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-border bg-background p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-base font-semibold" id="create-node-title">
                Create Node
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
                  <Label htmlFor="node-siteCode">Site code</Label>
                  <Input
                    defaultValue={state.values.siteCode ?? ""}
                    id="node-siteCode"
                    name="siteCode"
                    placeholder="BLR-UPF-08"
                  />
                  {state.fieldErrors.siteCode?.[0] ? (
                    <p className="text-sm text-destructive">{state.fieldErrors.siteCode[0]}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="node-name">Node name</Label>
                  <Input
                    defaultValue={state.values.name ?? ""}
                    id="node-name"
                    name="name"
                    placeholder="Bengaluru UPF 08"
                  />
                  {state.fieldErrors.name?.[0] ? (
                    <p className="text-sm text-destructive">{state.fieldErrors.name[0]}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="node-region">Region</Label>
                  <Input
                    defaultValue={state.values.region ?? ""}
                    id="node-region"
                    name="region"
                    placeholder="South"
                  />
                  {state.fieldErrors.region?.[0] ? (
                    <p className="text-sm text-destructive">{state.fieldErrors.region[0]}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="node-vendor">Vendor</Label>
                  <Input
                    defaultValue={state.values.vendor ?? ""}
                    id="node-vendor"
                    name="vendor"
                    placeholder="Nokia"
                  />
                  {state.fieldErrors.vendor?.[0] ? (
                    <p className="text-sm text-destructive">{state.fieldErrors.vendor[0]}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="node-type">Node type</Label>
                  <Input
                    defaultValue={state.values.nodeType ?? ""}
                    id="node-type"
                    name="nodeType"
                    placeholder="UPF"
                  />
                  {state.fieldErrors.nodeType?.[0] ? (
                    <p className="text-sm text-destructive">{state.fieldErrors.nodeType[0]}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="node-slice">Network slice</Label>
                  <Input
                    defaultValue={state.values.networkSlice ?? ""}
                    id="node-slice"
                    name="networkSlice"
                    placeholder="eMBB-Enterprise"
                  />
                  {state.fieldErrors.networkSlice?.[0] ? (
                    <p className="text-sm text-destructive">{state.fieldErrors.networkSlice[0]}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="node-version">Software version</Label>
                  <Input
                    defaultValue={state.values.softwareVersion ?? ""}
                    id="node-version"
                    name="softwareVersion"
                    placeholder="25.1.0"
                  />
                  {state.fieldErrors.softwareVersion?.[0] ? (
                    <p className="text-sm text-destructive">{state.fieldErrors.softwareVersion[0]}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="node-status">Status</Label>
                  <select
                    className={selectClassName}
                    defaultValue={state.values.status || "online"}
                    id="node-status"
                    name="status"
                  >
                    <option value="online">online</option>
                    <option value="degraded">degraded</option>
                    <option value="offline">offline</option>
                    <option value="maintenance">maintenance</option>
                  </select>
                  {state.fieldErrors.status?.[0] ? (
                    <p className="text-sm text-destructive">{state.fieldErrors.status[0]}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="node-availability">Availability %</Label>
                  <Input
                    defaultValue={state.values.availabilityPct ?? ""}
                    id="node-availability"
                    name="availabilityPct"
                    placeholder="99.20"
                    step="0.01"
                    type="number"
                  />
                  {state.fieldErrors.availabilityPct?.[0] ? (
                    <p className="text-sm text-destructive">
                      {state.fieldErrors.availabilityPct[0]}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button disabled={pending} type="submit">
                  {pending ? "Creating..." : "Create node"}
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
