import type { ReactNode } from "react";
import { AppProviders } from "@/components/providers/app-providers";
import { redirectAuthenticatedUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

type AuthLayoutProps = {
  children: ReactNode;
};

export default async function AuthLayout({ children }: AuthLayoutProps) {
  await redirectAuthenticatedUser();

  return <AppProviders className="dashboard-theme">{children}</AppProviders>;
}
