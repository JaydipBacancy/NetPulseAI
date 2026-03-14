import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NetPulse AI",
    template: "%s | NetPulse AI",
  },
  description:
    "Cloud-native 5G network monitoring, alerting, testing, and AI-assisted analysis for telecom teams.",
  applicationName: "NetPulse AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
