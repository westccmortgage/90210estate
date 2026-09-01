import type { MetadataRoute } from "next";
import { getMarketplaceAgents, getMarketplaceListings } from "./lib/crm-marketplace";
import { neighborhoods } from "./lib/neighborhoods";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const base = "https://90210estate.com";

const routes: Array<{
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
}> = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/listings", changeFrequency: "daily", priority: 0.95 },
  { path: "/neighborhoods", changeFrequency: "weekly", priority: 0.9 },
  { path: "/open-houses", changeFrequency: "daily", priority: 0.85 },
  { path: "/agents", changeFrequency: "daily", priority: 0.8 },
  { path: "/market", changeFrequency: "weekly", priority: 0.75 },
  { path: "/financing", changeFrequency: "monthly", priority: 0.7 },
  { path: "/for-realtors", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
];

function validDate(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [listings, agents] = await Promise.all([
    getMarketplaceListings(),
    getMarketplaceAgents(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${base}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const neighborhoodEntries: MetadataRoute.Sitemap = neighborhoods.map((area) => ({
    url: `${base}/neighborhoods/${area.slug}`,
    changeFrequency: "weekly",
    priority: area.slug === "beverly-hills" ? 0.9 : 0.85,
  }));

  const listingEntries: MetadataRoute.Sitemap = listings
    .filter((listing) => Boolean(listing.slug))
    .map((listing) => ({
      url: `${base}/listings/${listing.slug}`,
      lastModified: validDate(listing.updated_at || listing.published_at),
      changeFrequency: "daily",
      priority: 0.9,
    }));

  const agentEntries: MetadataRoute.Sitemap = agents
    .filter((agent) => Boolean(agent.slug))
    .map((agent) => ({
      url: `${base}/agents/${agent.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticEntries, ...neighborhoodEntries, ...listingEntries, ...agentEntries];
}
