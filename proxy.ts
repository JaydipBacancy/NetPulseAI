import type { NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSupabaseSession(request);
}

export const config = {
  matcher: [
    "/signin",
    "/signup",
    "/dashboard/:path*",
    "/nodes/:path*",
    "/alerts/:path*",
    "/tests/:path*",
    "/analysis/:path*",
    "/reports/:path*",
    "/users/:path*",
    "/auth/confirm",
  ],
};
