import type { NextConfig } from "next";

type RemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

function hasFileExtension(pathname: string) {
  return pathname.split("/").at(-1)?.includes(".") ?? false;
}

function createRemotePattern(urlValue: string | undefined): RemotePattern | null {
  if (!urlValue) {
    return null;
  }

  try {
    const url = new URL(urlValue);
    const protocol =
      url.protocol === "http:" ? "http" : url.protocol === "https:" ? "https" : undefined;
    const normalizedPathname =
      url.pathname === "/"
        ? "/**"
        : hasFileExtension(url.pathname)
          ? url.pathname
          : `${url.pathname.replace(/\/$/, "")}/**`;

    return {
      hostname: url.hostname,
      pathname: normalizedPathname,
      port: url.port,
      protocol,
    };
  } catch {
    return null;
  }
}

function getMarketingRemotePatterns() {
  const candidates = [
    process.env.NEXT_PUBLIC_MARKETING_ASSET_BASE_URL,
    process.env.NEXT_PUBLIC_MARKETING_HERO_IMAGE_URL,
    process.env.NEXT_PUBLIC_MARKETING_OPERATIONS_IMAGE_URL,
    process.env.NEXT_PUBLIC_MARKETING_WORKFLOW_IMAGE_URL,
  ];

  const dedupedPatterns = new Map<string, RemotePattern>();

  for (const pattern of candidates.map(createRemotePattern)) {
    if (!pattern) {
      continue;
    }

    const key = `${pattern.protocol}:${pattern.hostname}:${pattern.port}:${pattern.pathname}`;
    dedupedPatterns.set(key, pattern);
  }

  return [...dedupedPatterns.values()];
}

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: getMarketingRemotePatterns(),
  },
};

export default nextConfig;
