"use client";

import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

type AppProvidersProps = {
  children: ReactNode;
  className?: string;
};

export function AppProviders({ children, className }: AppProvidersProps) {
  return (
    <div className={cn(className)}>
      {children}
      <Toaster />
    </div>
  );
}
