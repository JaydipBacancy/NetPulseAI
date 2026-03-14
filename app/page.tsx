import { MarketingHome } from "@/components/marketing/marketing-home";
import { getMarketingAssetUrls } from "@/lib/marketing/assets";

export default function Home() {
  return <MarketingHome assets={getMarketingAssetUrls()} />;
}
