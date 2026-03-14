import "server-only";

import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import {
  canManageOperations,
  canManageUsers,
} from "@/lib/access-control";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  WorkspacePermissions,
  WorkspaceProfile,
} from "@/types/access";
import type { Database } from "@/types/supabase";

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

type ProfileRow = Pick<
  Database["public"]["Tables"]["user_profiles"]["Row"],
  "created_at" | "email" | "full_name" | "id" | "is_active" | "role" | "updated_at"
>;

type WorkspaceAccess = {
  authEmail: string;
  permissions: WorkspacePermissions | null;
  profile: WorkspaceProfile | null;
  user: User | null;
};

export class AccessControlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AccessControlError";
  }
}

function mapProfile(row: ProfileRow): WorkspaceProfile {
  return {
    createdAt: row.created_at,
    email: row.email,
    fullName: row.full_name,
    id: row.id,
    isActive: row.is_active,
    role: row.role,
    updatedAt: row.updated_at,
  };
}

function buildWorkspacePermissions(profile: WorkspaceProfile): WorkspacePermissions {
  const role = profile.role;

  return {
    canManageOperations: profile.isActive && canManageOperations(role),
    canManageUsers: profile.isActive && canManageUsers(role),
  };
}

async function fetchWorkspaceAccess(
  supabase: SupabaseServerClient,
): Promise<WorkspaceAccess> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      authEmail: "",
      permissions: null,
      profile: null,
      user: null,
    };
  }

  const { data: profileRow } = await supabase
    .from("user_profiles")
    .select("id,email,full_name,role,is_active,created_at,updated_at")
    .eq("id", user.id)
    .maybeSingle();

  const profile = profileRow ? mapProfile(profileRow) : null;

  return {
    authEmail: user.email ?? profile?.email ?? "",
    permissions: profile ? buildWorkspacePermissions(profile) : null,
    profile,
    user,
  };
}

export const getCurrentWorkspaceAccess = cache(async () => {
  const supabase = await createSupabaseServerClient();
  return fetchWorkspaceAccess(supabase);
});

export async function getWorkspaceAccessForClient(
  supabase: SupabaseServerClient,
) {
  return fetchWorkspaceAccess(supabase);
}

export async function requireAuthenticatedWorkspace() {
  const access = await getCurrentWorkspaceAccess();

  if (!access.user || !access.profile || !access.profile.isActive) {
    redirect("/signin");
  }

  return access as WorkspaceAccess & {
    permissions: WorkspacePermissions;
    profile: WorkspaceProfile;
    user: User;
  };
}

export async function assertActiveWorkspaceUser() {
  const access = await getCurrentWorkspaceAccess();

  if (!access.user) {
    throw new AccessControlError("Please sign in to continue.");
  }

  if (!access.profile) {
    throw new AccessControlError(
      "Your workspace access is not configured yet. Contact an administrator.",
    );
  }

  if (!access.profile.isActive) {
    throw new AccessControlError(
      "Your workspace access is disabled. Contact an administrator.",
    );
  }

  return access as WorkspaceAccess & {
    permissions: WorkspacePermissions;
    profile: WorkspaceProfile;
    user: User;
  };
}

export async function assertOperationsAccess() {
  const access = await assertActiveWorkspaceUser();

  if (!access.permissions.canManageOperations) {
    throw new AccessControlError("Your role is read-only in this workspace.");
  }

  return access;
}

export async function assertAdminAccess() {
  const access = await assertActiveWorkspaceUser();

  if (!access.permissions.canManageUsers) {
    throw new AccessControlError("Only admins can manage workspace users.");
  }

  return access;
}

export function getAccessControlMessage(
  error: unknown,
  fallbackMessage: string,
) {
  if (error instanceof AccessControlError) {
    return error.message;
  }

  return fallbackMessage;
}
