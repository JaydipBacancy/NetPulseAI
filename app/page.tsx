import { MarketingHome } from "@/components/marketing/marketing-home";
import { getMarketingAssetUrls } from "@/lib/marketing/assets";
import { getCurrentWorkspaceAccess } from "@/lib/supabase/rbac";

export const dynamic = "force-dynamic";

export default async function Home() {
  const access = await getCurrentWorkspaceAccess();
  const viewer = access.user
    ? {
        email: access.authEmail || access.user.email || "",
        fullName: access.profile?.fullName ?? null,
        isActive: access.profile?.isActive ?? false,
      }
    : null;

  return <MarketingHome assets={getMarketingAssetUrls()} viewer={viewer} />;
}
