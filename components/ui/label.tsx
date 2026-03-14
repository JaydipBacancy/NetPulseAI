import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const labelVariants = cva("text-sm font-medium leading-none text-foreground");

type LabelProps = React.ComponentProps<"label"> &
  VariantProps<typeof labelVariants>;

function Label({ className, ...props }: LabelProps) {
  return <label className={cn(labelVariants(), className)} {...props} />;
}

export { Label };
