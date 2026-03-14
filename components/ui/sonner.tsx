"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      closeButton
      expand
      position="top-right"
      richColors
      toastOptions={{
        classNames: {
          toast:
            "border border-border/80 bg-card text-card-foreground shadow-[0_18px_50px_-38px_rgba(9,22,41,0.75)]",
          title: "text-sm font-semibold",
          description: "text-sm text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
