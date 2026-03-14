type MarketingAssetKey = "hero" | "operations" | "workflow";

export type MarketingAssetUrls = Record<MarketingAssetKey, string>;

const fallbackAssetMap: MarketingAssetUrls = {
  hero: "/marketing/hero-network-console.svg",
  operations: "/marketing/ops-command-center.svg",
  workflow: "/marketing/automation-workflow.svg",
};

const baseAssetFilenames: MarketingAssetUrls = {
  hero: "landing/hero-network-console.jpg",
  operations: "landing/ops-command-center.jpg",
  workflow: "landing/automation-workflow.jpg",
};

function normalizeBaseUrl(value: string | undefined) {
  if (!value) {
    return "";
  }

  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function resolveAssetUrl(
  baseUrl: string,
  overrideUrl: string | undefined,
  assetKey: MarketingAssetKey,
) {
  if (overrideUrl) {
    return overrideUrl;
  }

  if (baseUrl) {
    return `${baseUrl}/${baseAssetFilenames[assetKey]}`;
  }

  return fallbackAssetMap[assetKey];
}

export function getMarketingAssetUrls(): MarketingAssetUrls {
  const baseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_MARKETING_ASSET_BASE_URL);

  return {
    hero: resolveAssetUrl(
      baseUrl,
      process.env.NEXT_PUBLIC_MARKETING_HERO_IMAGE_URL,
      "hero",
    ),
    operations: resolveAssetUrl(
      baseUrl,
      process.env.NEXT_PUBLIC_MARKETING_OPERATIONS_IMAGE_URL,
      "operations",
    ),
    workflow: resolveAssetUrl(
      baseUrl,
      process.env.NEXT_PUBLIC_MARKETING_WORKFLOW_IMAGE_URL,
      "workflow",
    ),
  };
}
