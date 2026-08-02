export type MarketplaceAgent = {
  id: string;
  slug: string;
  display_name: string;
  first_name?: string | null;
  last_name?: string | null;
  title?: string | null;
  brokerage?: string | null;
  dre_license?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  company_logo_url?: string | null;
  service_areas?: string[];
};

export type MarketplacePhoto = {
  url: string;
  alt?: string | null;
  primary?: boolean;
};

export type MarketplaceListing = {
  id: string;
  agent_profile_id: string;
  slug: string;
  purpose?: string | null;
  status?: string | null;
  address: string;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  price?: number | null;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  property_type?: string | null;
  mls?: string | null;
  description?: string | null;
  features?: string[];
  photos?: MarketplacePhoto[];
  video?: { url?: string | null } | null;
  open_house?: { startsAt?: string | null; endsAt?: string | null; notes?: string | null } | null;
  published_at?: string;
  updated_at?: string;
  agent?: MarketplaceAgent | null;
};

const crmOrigin = (process.env.GRCRM_PUBLIC_URL || process.env.NEXT_PUBLIC_GRCRM_URL || "https://grcrm.com").replace(/\/$/, "");
const marketplaceId = process.env.MARKETPLACE_ID || "90210-estate";
const feedUrl = process.env.CRM_PUBLIC_FEED_URL || `${crmOrigin}/.netlify/functions/marketplace-public-feed`;

async function readFeed<T>(query = ""): Promise<T | null> {
  try {
    const url = new URL(feedUrl);
    const supplied = new URLSearchParams(query.replace(/^\?/, ""));
    supplied.forEach((value, key) => url.searchParams.set(key, value));
    url.searchParams.set("marketplace", marketplaceId);
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getMarketplaceListings(area?: string) {
  const params = new URLSearchParams();
  if (area) params.set("area", area);
  params.set("limit", "60");
  const data = await readFeed<{ ok: boolean; listings?: MarketplaceListing[] }>(`?${params.toString()}`);
  return data?.ok && Array.isArray(data.listings) ? data.listings : [];
}

export async function getMarketplaceListing(slug: string) {
  const data = await readFeed<{ ok: boolean; listing?: MarketplaceListing }>(`?listing=${encodeURIComponent(slug)}`);
  return data?.ok ? data.listing || null : null;
}

export async function getMarketplaceAgents() {
  const data = await readFeed<{ ok: boolean; agents?: MarketplaceAgent[] }>("?agents=1&limit=100");
  return data?.ok && Array.isArray(data.agents) ? data.agents : [];
}

export async function getMarketplaceAgent(slug: string) {
  const data = await readFeed<{ ok: boolean; agent?: MarketplaceAgent; listings?: MarketplaceListing[] }>(`?agent=${encodeURIComponent(slug)}&limit=60`);
  return data?.ok && data.agent ? { agent: data.agent, listings: data.listings || [] } : null;
}

export function formatPrice(value?: number | null, purpose?: string | null) {
  if (value == null) return "Price on request";
  const price = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  return purpose === "Rent" ? `${price}/mo` : price;
}

export const grcrmLoginUrl = `${crmOrigin}/login?source=90210-estate&marketplace=${encodeURIComponent(marketplaceId)}`;
