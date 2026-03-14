import "server-only";

import { redirect } from "next/navigation";
import { getCurrentWorkspaceAccess } from "@/lib/supabase/rbac";

export async function getCurrentUser() {
  const access = await getCurrentWorkspaceAccess();
  return access.user;
}

export async function redirectAuthenticatedUser() {
  const access = await getCurrentWorkspaceAccess();

  if (access.profile?.isActive) {
    redirect("/dashboard");
  }
}

export async function requireAuthenticatedUser() {
  const access = await getCurrentWorkspaceAccess();

  if (!access.user || !access.profile || !access.profile.isActive) {
    redirect("/signin");
  }

  return access.user;
}
